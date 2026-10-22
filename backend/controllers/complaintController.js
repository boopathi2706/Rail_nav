const fs = require("fs");
const path = require("path");

const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Station = require("../models/Station");
const Officer = require("../models/Officer");

const uploadToCloudinary = require("../utils/cloudinaryUpload");

// ======================================================
// LOAD TRAIN DATA
// ======================================================

const trainDataPath = path.join(
  __dirname,
  "../data/train_details.json"
);

let trainDetails = [];

try {
  const trainFile = fs.readFileSync(
    trainDataPath,
    "utf-8"
  );

  trainDetails = JSON.parse(trainFile);

  console.log(
    "Train details loaded successfully"
  );
} catch (error) {
  console.error(
    "Failed to load train_details.json:",
    error.message
  );
}

// ======================================================
// COMPLAINT CATEGORY → OFFICER TYPE
// ======================================================

const getOfficerType = (category) => {
  const categoryMap = {
    electrical: "electric",
    electric: "electric",

    water: "water",

    cleanliness: "cleaning",
    cleaning: "cleaning",

    ticketing: "ttr",
    ttr: "ttr",

    catering: "others",
    security: "others",
    medical: "others",
    staff: "others",
    coach: "others",
    platform: "others",
    other: "others",
  };

  return (
    categoryMap[
      String(category)
        .toLowerCase()
        .trim()
    ] || "others"
  );
};

// ======================================================
// FIND TRAIN
// ======================================================

const findTrain = (trainNumber) => {
  if (!Array.isArray(trainDetails)) {
    return null;
  }

  return trainDetails.find((train) => {
    const number =
      train.trainNumber ||
      train.train_number ||
      train.number ||
      train.trainNo ||
      train.train_no;

    return (
      String(number).trim() ===
      String(trainNumber).trim()
    );
  });
};

// ======================================================
// GET TRAIN STATIONS
// ======================================================

const getTrainStations = (train) => {
  if (!train) {
    return [];
  }

  return (
    train.stations ||
    train.route ||
    train.routes ||
    train.stationList ||
    train.station_list ||
    []
  );
};

// ======================================================
// HAVERSINE DISTANCE
// ======================================================

const calculateDistanceInKm = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

// ======================================================
// GET STATION COORDINATES
// ======================================================

const getStationCoordinates = (
  station
) => {
  if (!station) {
    return null;
  }

  // ----------------------------------------------------
  // coordinates: { latitude, longitude }
  // OR
  // coordinates: { lat, lng }
  // ----------------------------------------------------

  if (
    station.coordinates &&
    typeof station.coordinates ===
      "object"
  ) {
    const lat =
      station.coordinates.latitude ??
      station.coordinates.lat;

    const lng =
      station.coordinates.longitude ??
      station.coordinates.lng ??
      station.coordinates.lon;

    if (
      lat !== undefined &&
      lng !== undefined
    ) {
      return {
        latitude: Number(lat),
        longitude: Number(lng),
      };
    }
  }

  // ----------------------------------------------------
  // latitude / longitude directly
  // ----------------------------------------------------

  if (
    station.latitude !== undefined &&
    station.longitude !== undefined
  ) {
    return {
      latitude: Number(
        station.latitude
      ),
      longitude: Number(
        station.longitude
      ),
    };
  }

  // ----------------------------------------------------
  // lat / lng directly
  // ----------------------------------------------------

  if (
    station.lat !== undefined &&
    station.lng !== undefined
  ) {
    return {
      latitude: Number(
        station.lat
      ),
      longitude: Number(
        station.lng
      ),
    };
  }

  return null;
};

// ======================================================
// FIND STATION BY NAME
// ======================================================

const findStationByName = async (
  stationName
) => {
  if (!stationName) {
    return null;
  }

  const escapedName =
    String(stationName)
      .trim()
      .replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

  return await Station.findOne({
    stationName: {
      $regex: `^${escapedName}$`,
      $options: "i",
    },
  });
};

// ======================================================
// FIND CLOSEST REGISTERED STATION
// ======================================================

const findCurrentStationByGPS =
  async (
    latitude,
    longitude,
    trainStations
  ) => {
    if (
      !Array.isArray(
        trainStations
      )
    ) {
      return null;
    }

    let closestStation = null;
    let closestDistance = Infinity;

    for (
      const routeStation of
      trainStations
    ) {
      const stationName =
        typeof routeStation ===
        "string"
          ? routeStation
          : routeStation.stationName ||
            routeStation.name;

      if (!stationName) {
        continue;
      }

      const station =
        await findStationByName(
          stationName
        );

      if (!station) {
        continue;
      }

      const coordinates =
        getStationCoordinates(
          station
        );

      if (!coordinates) {
        console.log(
          `No coordinates found for ${station.stationName}`
        );

        continue;
      }

      const distance =
        calculateDistanceInKm(
          Number(latitude),
          Number(longitude),
          coordinates.latitude,
          coordinates.longitude
        );

      console.log(
        `GPS → ${station.stationName}: ${distance.toFixed(
          3
        )} KM`
      );

      if (
        distance <
        closestDistance
      ) {
        closestDistance =
          distance;

        closestStation = {
          station,
          stationName:
            station.stationName,
          distance,
        };
      }
    }

    return closestStation;
  };

// ======================================================
// GEMINI - GET COMPLETE ROUTE
// ======================================================

const getNextStationsFromGemini =
  async ({
    latitude,
    longitude,
    trainNumber,
    train,
  }) => {
    if (
      !process.env.GEMINI_API_KEY
    ) {
      throw new Error(
        "GEMINI_API_KEY is missing in .env"
      );
    }

    const trainStations =
      getTrainStations(train);

    const prompt = `
You are a railway navigation assistant.

Passenger GPS location:

Latitude: ${latitude}
Longitude: ${longitude}

Train Number:
${trainNumber}

Train information:
${JSON.stringify(
  train,
  null,
  2
)}

Known train route:
${JSON.stringify(
  trainStations,
  null,
  2
)}

Determine the complete railway route order.

IMPORTANT RULES:

1. Use ONLY stations from the provided train route.
2. Do NOT invent station names.
3. Do NOT skip stations.
4. Keep the exact railway route order.
5. Return all stations in route order.
6. Do not return explanations.

Return ONLY valid JSON:

{
  "route": [
    "Station 1",
    "Station 2",
    "Station 3"
  ]
}
`;

    const response =
      await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],

            generationConfig: {
              temperature: 0,

              responseMimeType:
                "application/json",

              responseSchema: {
                type: "OBJECT",

                properties: {
                  route: {
                    type: "ARRAY",

                    items: {
                      type: "STRING",
                    },
                  },
                },

                required: [
                  "route",
                ],
              },
            },
          }),
        }
      );

    // ==================================================
    // GEMINI API ERROR
    // ==================================================

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Gemini API Error: ${errorText}`
      );
    }

    const data =
      await response.json();

    // ==================================================
    // GET GEMINI TEXT
    // ==================================================

    const text =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!text) {
      console.error(
        "Full Gemini Response:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      throw new Error(
        "Gemini returned empty response"
      );
    }

    console.log(
      "\n========== RAW GEMINI RESPONSE =========="
    );

    console.log(text);

    // ==================================================
    // PARSE GEMINI JSON
    // ==================================================

    let navigation;

    try {
      navigation =
        JSON.parse(
          text.trim()
        );
    } catch (error) {
      console.error(
        "Gemini JSON Parse Error:",
        error.message
      );

      console.error(
        "Gemini Response:",
        text
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    // ==================================================
    // VALIDATE ROUTE
    // ==================================================

    if (
      !navigation ||
      !Array.isArray(
        navigation.route
      )
    ) {
      throw new Error(
        "Gemini returned invalid route"
      );
    }

    return navigation.route
      .filter(
        (station) =>
          typeof station ===
          "string"
      )
      .map(
        (station) =>
          station.trim()
      );
  };

// ======================================================
// FIND OFFICER
// ======================================================

const findOfficer = async (
  stationId,
  complaintCategory
) => {
  const officerType =
    getOfficerType(
      complaintCategory
    );

  console.log(
    "Searching officer:",
    {
      stationId:
        String(stationId),
      officerType,
    }
  );

  // ====================================================
  // IMPORTANT:
  // Convert station ID correctly for Mongoose.
  // ====================================================

  const officer =
    await Officer.findOne({
      stationId:
        stationId,
      officerType:
        officerType,
    });

  return officer;
};

// ======================================================
// UPLOAD COMPLAINT EVIDENCE
// ======================================================

const uploadComplaintEvidence =
  async (files) => {
    const imageUrls = [];
    const videoUrls = [];

    console.log(
      "========== EVIDENCE UPLOAD =========="
    );

    console.log(
      "Files received:",
      {
        images:
          files?.images?.length ||
          0,

        videos:
          files?.videos?.length ||
          0,
      }
    );

    // ==================================================
    // IMAGES
    // ==================================================

    if (
      files?.images?.length
    ) {
      for (
        const file of
        files.images
      ) {
        console.log(
          "Uploading IMAGE:",
          {
            name:
              file.originalname,

            mimetype:
              file.mimetype,

            size:
              file.size,
          }
        );

        try {
          const result =
            await uploadToCloudinary(
              file.buffer,

              "rail-nav/complaints/evidence/images",

              "image"
            );

          console.log(
            "IMAGE UPLOAD SUCCESS:",
            result.secure_url
          );

          imageUrls.push(
            result.secure_url
          );
        } catch (error) {
          console.error(
            "IMAGE CLOUDINARY ERROR:",
            {
              message:
                error.message,

              http_code:
                error.http_code,

              name:
                error.name,
            }
          );

          throw error;
        }
      }
    }

    // ==================================================
    // VIDEOS
    // ==================================================

    if (
      files?.videos?.length
    ) {
      for (
        const file of
        files.videos
      ) {
        console.log(
          "Uploading VIDEO:",
          {
            name:
              file.originalname,

            mimetype:
              file.mimetype,

            size:
              file.size,
          }
        );

        try {
          const result =
            await uploadToCloudinary(
              file.buffer,

              "rail-nav/complaints/evidence/videos",

              "video"
            );

          console.log(
            "VIDEO UPLOAD SUCCESS:",
            result.secure_url
          );

          videoUrls.push(
            result.secure_url
          );
        } catch (error) {
          console.error(
            "VIDEO CLOUDINARY ERROR:",
            {
              message:
                error.message,

              http_code:
                error.http_code,

              name:
                error.name,
            }
          );

          throw error;
        }
      }
    }

    return {
      images: imageUrls,
      videos: videoUrls,
    };
  };

// ======================================================
// CREATE COMPLAINT
// ======================================================

const createComplaint =
  async (req, res) => {
    try {
      // ==================================================
      // 1. VERIFY USER
      // ==================================================

      if (
        !req.user ||
        !req.user.userId
      ) {
        return res.status(401).json({
          success: false,

          message:
            "User authentication required",
        });
      }

      // ==================================================
      // 2. GET USER
      // ==================================================

      const user =
        await User.findById(
          req.user.userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,

          message:
            "User not found",
        });
      }

      // ==================================================
      // 3. FORM DATA
      // ==================================================

      const {
        pnrNumber,
        trainNumber,
        incidentDateTime,
        complaintCategory,
        latitude,
        longitude,
      } = req.body;

      // ==================================================
      // 4. VALIDATION
      // ==================================================

      if (
        !pnrNumber ||
        !trainNumber ||
        !incidentDateTime ||
        !complaintCategory
      ) {
        return res.status(400).json({
          success: false,

          message:
            "PNR number, train number, incident date/time and complaint category are required",
        });
      }

      if (
        latitude ===
          undefined ||
        longitude ===
          undefined
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Current latitude and longitude are required",
        });
      }

      const userLatitude =
        Number(latitude);

      const userLongitude =
        Number(longitude);

      if (
        Number.isNaN(
          userLatitude
        ) ||
        Number.isNaN(
          userLongitude
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Latitude and longitude must be valid numbers",
        });
      }

      // ==================================================
      // 5. UPLOAD EVIDENCE
      // ==================================================

      const evidenceProof =
        await uploadComplaintEvidence(
          req.files
        );

      console.log(
        "Cloudinary Evidence:",
        evidenceProof
      );

      // ==================================================
      // 6. FIND TRAIN
      // ==================================================

      const train =
        findTrain(
          trainNumber
        );

      if (!train) {
        return res.status(404).json({
          success: false,

          message:
            "Train details not found for this train number",
        });
      }

      // ==================================================
      // 7. GET TRAIN ROUTE
      // ==================================================

      const trainStations =
        getTrainStations(
          train
        );

      if (
        !Array.isArray(
          trainStations
        ) ||
        trainStations.length ===
          0
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Train route not available",
        });
      }

      // ==================================================
      // 8. FIND CLOSEST REGISTERED STATION
      // ==================================================

      const closestStation =
        await findCurrentStationByGPS(
          userLatitude,
          userLongitude,
          trainStations
        );

      if (!closestStation) {
        return res.status(404).json({
          success: false,

          message:
            "Unable to find a registered station near the provided location",
        });
      }

      console.log(
        "\n========== GPS STATION RESULT =========="
      );

      console.log(
        "Closest registered station:",
        closestStation.stationName
      );

      console.log(
        "Distance:",
        closestStation.distance.toFixed(
          3
        ),
        "KM"
      );

      const isWithinOneKm =
        closestStation.distance <=
        1;

      // ==================================================
      // IMPORTANT BUSINESS RULE
      // ==================================================
      //
      // <= 1 KM:
      //
      // GPS is near station.
      // That station is CURRENT STATION.
      //
      // > 1 KM:
      //
      // GPS is before the station.
      // That station is NEXT STATION.
      //
      // BUT IN BOTH CASES:
      //
      // Officer checking starts FROM this station.
      //
      // This is the important fix.
      // ==================================================

      if (isWithinOneKm) {
        console.log(
          `GPS is within 1 KM of ${closestStation.stationName}`
        );

        console.log(
          `Current station = ${closestStation.stationName}`
        );
      } else {
        console.log(
          `GPS is more than 1 KM from registered stations`
        );

        console.log(
          `Closest route station is NEXT station = ${closestStation.stationName}`
        );
      }

      // ==================================================
      // 9. GET COMPLETE ROUTE FROM GEMINI
      // ==================================================

      const geminiRoute =
        await getNextStationsFromGemini(
          {
            latitude:
              userLatitude,

            longitude:
              userLongitude,

            trainNumber,

            train,
          }
        );

      console.log(
        "\n========== GEMINI ROUTE =========="
      );

      console.log(
        geminiRoute
      );

      // ==================================================
      // 10. BUILD STATION DATABASE ROUTE
      // ==================================================

      const routeStations = [];

      for (
        const stationName of
        geminiRoute
      ) {
        const station =
          await findStationByName(
            stationName
          );

        if (!station) {
          console.log(
            "Station not found in database:",
            stationName
          );

          continue;
        }

        routeStations.push({
          stationId:
            station._id,

          stationName:
            station.stationName,
        });
      }

      if (
        routeStations.length ===
        0
      ) {
        return res.status(404).json({
          success: false,

          message:
            "No stations from the train route were found in the station database",
        });
      }

      // ==================================================
      // 11. FIND CLOSEST STATION IN ROUTE
      // ==================================================

      let stationStartIndex =
        routeStations.findIndex(
          (route) =>
            String(
              route.stationName
            ).toLowerCase() ===
            String(
              closestStation.stationName
            ).toLowerCase()
        );

      // ==================================================
      // FALLBACK USING STATION ID
      // ==================================================

      if (
        stationStartIndex ===
        -1
      ) {
        stationStartIndex =
          routeStations.findIndex(
            (route) =>
              String(
                route.stationId
              ) ===
              String(
                closestStation
                  .station._id
              )
          );
      }

      // ==================================================
      // COULD NOT FIND STATION IN ROUTE
      // ==================================================

      if (
        stationStartIndex ===
        -1
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Closest station is not available in the train route",
        });
      }

      console.log(
        "\n========== STATION START =========="
      );

      console.log(
        "Station:",
        routeStations[
          stationStartIndex
        ].stationName
      );

      console.log(
        "Index:",
        stationStartIndex
      );

      // ==================================================
      // IMPORTANT FIX
      // ==================================================
      //
      // DO NOT DO:
      //
      // stationStartIndex + 1
      //
      // when GPS > 1 KM.
      //
      // The closest station itself is the station
      // we must check.
      //
      // Example:
      //
      // GPS > 1 KM
      // ↓
      // Kinathukadavu
      // ↓
      // Check Kinathukadavu officer
      //
      // If no officer:
      // ↓
      // Pollachi
      //
      // Therefore:
      //
      // officerStartIndex =
      // stationStartIndex
      // ==================================================

      const officerStartIndex =
        stationStartIndex;

      // ==================================================
      // 12. DESCRIPTION HISTORY
      // ==================================================

      const descriptionHistory =
        [];

      // ==================================================
      // 13. FIND OFFICER
      // ==================================================

      let assignedOfficer =
        null;

      let assignedStation =
        null;

      let assignedStationIndex =
        -1;

      console.log(
        "\n========== STATIONS TO CHECK =========="
      );

      console.log(
        routeStations
          .slice(
            officerStartIndex
          )
          .map(
            (station) =>
              station.stationName
          )
      );

      // ==================================================
      // CHECK STATIONS ONE BY ONE
      // ==================================================

      for (
        let i =
          officerStartIndex;
        i <
        routeStations.length;
        i++
      ) {
        const route =
          routeStations[i];

        const officerType =
          getOfficerType(
            complaintCategory
          );

        console.log(
          `\nChecking ${officerType} officer at station: ${route.stationName}`
        );

        // ==================================================
        // FIND OFFICER
        // ==================================================

        const officer =
          await findOfficer(
            route.stationId,
            complaintCategory
          );

        // ==================================================
        // OFFICER FOUND
        // ==================================================

        if (officer) {
          console.log(
            `✅ ${officerType} officer FOUND at ${route.stationName}`
          );

          assignedOfficer =
            officer;

          assignedStation =
            route;

          assignedStationIndex =
            i;

          break;
        }

        // ==================================================
        // OFFICER NOT FOUND
        // ==================================================

        console.log(
          `❌ No ${officerType} officer at ${route.stationName}`
        );

        const nextStation =
          routeStations[i + 1];

        let message;

        if (nextStation) {
          message =
            `No suitable ${officerType} officer is available at ${route.stationName}. We are moving your complaint to ${nextStation.stationName}.`;
        } else {
          message =
            `No suitable ${officerType} officer is available at ${route.stationName}. There are no more stations available on this route.`;
        }

        console.log(
          "Description:",
          message
        );

        descriptionHistory.push({
          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 8)}`,

          who:
            "station",

          message,

          createdAt:
            new Date(),
        });
      }

      // ==================================================
      // 14. NO OFFICER FOUND
      // ==================================================

      if (!assignedOfficer) {
        const lastCheckedStation =
          routeStations[
            routeStations.length -
              1
          ];

        const finalMessage =
          `No suitable ${getOfficerType(
            complaintCategory
          )} officer was found in the remaining stations on this route. Your complaint remains pending.`;

        descriptionHistory.push({
          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 8)}`,

          who:
            "station",

          message:
            finalMessage,

          createdAt:
            new Date(),
        });

        // ==================================================
        // NEXT ROUTES
        //
        // Only stations after the last checked station.
        // ==================================================

        const remainingNextRoutes =
          [];

        console.log(
          "\nNo officer found anywhere."
        );

        console.log(
          "Description history:",
          descriptionHistory
        );

        // ==================================================
        // CREATE PENDING COMPLAINT
        // ==================================================

        const complaint =
          await Complaint.create({
            userId:
              user._id,

            userName:
              user.name,

            phoneNumber:
              user.phoneNumber,

            email:
              user.email,

            pnrNumber,

            trainNumber,

            incidentDateTime,

            complaintCategory,

            evidenceProof,

            nextStationName:
              lastCheckedStation.stationName,

            stationId:
              lastCheckedStation.stationId,

            officerId:
              null,

            nextRoutes:
              remainingNextRoutes,

            descriptions:
              descriptionHistory,

            status:
              "pending",

            solvedProof: {
              images: [],
              videos: [],
            },

            solvedDateTime:
              null,
          });

        return res.status(201).json({
          success: true,

          message:
            "Complaint created but no suitable officer is currently available",

          data:
            complaint,
        });
      }

      // ==================================================
      // 15. NEXT ROUTES
      // ==================================================
      //
      // IMPORTANT:
      //
      // If assigned station = Pollachi:
      //
      // nextRoutes =
      // stations AFTER Pollachi
      //
      // Pollachi itself is NOT included.
      //
      // Kinathukadavu is also NOT included.
      //
      // Example:
      //
      // Kinathukadavu
      // Pollachi
      // Gomangalam
      // Udumalaippettai
      //
      // Assigned = Pollachi
      //
      // nextRoutes:
      //
      // Gomangalam
      // Udumalaippettai
      //
      // ==================================================

      const remainingNextRoutes =
        routeStations
          .slice(
            assignedStationIndex + 1
          )
          .map(
            (route) => ({
              stationId:
                route.stationId,

              stationName:
                route.stationName,
            })
          );

      // ==================================================
      // 16. LOG FINAL ROUTE
      // ==================================================

      console.log(
        "\n========== FINAL ASSIGNMENT =========="
      );

      console.log(
        "Assigned Station:",
        assignedStation.stationName
      );

      console.log(
        "Assigned Station ID:",
        String(
          assignedStation.stationId
        )
      );

      console.log(
        "Assigned Officer:",
        String(
          assignedOfficer._id
        )
      );

      console.log(
        "Descriptions:",
        descriptionHistory
      );

      console.log(
        "Next Routes:",
        remainingNextRoutes
      );

      // ==================================================
      // 17. CREATE COMPLAINT
      // ==================================================

      const complaint =
        await Complaint.create({
          // ==============================================
          // USER
          // ==============================================

          userId:
            user._id,

          userName:
            user.name,

          phoneNumber:
            user.phoneNumber,

          email:
            user.email,

          // ==============================================
          // COMPLAINT
          // ==============================================

          pnrNumber,

          trainNumber,

          incidentDateTime,

          complaintCategory,

          // ==============================================
          // EVIDENCE
          // ==============================================

          evidenceProof,

          // ==============================================
          // ASSIGNED STATION
          // ==============================================

          nextStationName:
            assignedStation.stationName,

          stationId:
            assignedStation.stationId,

          // ==============================================
          // ASSIGNED OFFICER
          // ==============================================

          officerId:
            assignedOfficer._id,

          // ==============================================
          // ONLY STATIONS AFTER ASSIGNED STATION
          // ==============================================

          nextRoutes:
            remainingNextRoutes,

          // ==============================================
          // DESCRIPTION HISTORY
          // ==============================================

          descriptions:
            descriptionHistory,

          // ==============================================
          // STATUS
          // ==============================================

          status:
            "pending",

          // ==============================================
          // SOLVED PROOF
          // ==============================================

          solvedProof: {
            images: [],
            videos: [],
          },

          solvedDateTime:
            null,
        });

      // ==================================================
      // 18. RESPONSE
      // ==================================================

      return res.status(201).json({
        success: true,

        message:
          "Complaint created and assigned successfully",

        data:
          complaint,
      });
    } catch (error) {
      console.error(
        "Create Complaint Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to create complaint",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };








  // ======================================================
// MOVE COMPLAINT TO NEXT STATION
// ======================================================


const moveNextStation = async (req, res) => {
  try {

    // ==================================================
    // 1. GET REQUEST DATA
    // ==================================================

    const {
      complaintId,
      message,
      who,
    } = req.body;

    // ==================================================
    // 2. VALIDATE REQUEST
    // ==================================================

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!who) {
      return res.status(400).json({
        success: false,
        message:
          'User type is required. Use "station" or "officer"',
      });
    }

    const userType =
      String(who)
        .trim()
        .toLowerCase();

    if (
      userType !== "station" &&
      userType !== "officer"
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid user type. "who" must be "station" or "officer"',
      });
    }

    // ==================================================
    // 3. FIND COMPLAINT
    // ==================================================

    const complaint =
      await Complaint.findById(
        complaintId
      );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // ==================================================
    // 4. CHECK NEXT ROUTES
    // ==================================================

    if (
      !Array.isArray(
        complaint.nextRoutes
      ) ||
      complaint.nextRoutes.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No next station is available for this complaint",
      });
    }

    // ==================================================
    // 5. GET REQUIRED OFFICER TYPE
    // ==================================================

    const officerType =
      getOfficerType(
        complaint.complaintCategory
      );

    console.log(
      "\n=========================================="
    );

    console.log(
      "MOVE NEXT STATION"
    );

    console.log(
      "=========================================="
    );

    console.log(
      "Complaint ID:",
      complaint._id
    );

    console.log(
      "Complaint Category:",
      complaint.complaintCategory
    );

    console.log(
      "Required Officer Type:",
      officerType
    );

    console.log(
      "Current Assigned Station:",
      complaint.nextStationName
    );

    console.log(
      "Next Routes:",
      complaint.nextRoutes.map(
        (route) =>
          route.stationName
      )
    );

    // ==================================================
    // 6. FIND NEXT STATION WITH OFFICER
    // ==================================================

    let assignedOfficer = null;

    let assignedStation = null;

    let assignedIndex = -1;

    // ==================================================
    // CHECK EACH NEXT STATION
    // ==================================================

    for (
      let i = 0;
      i < complaint.nextRoutes.length;
      i++
    ) {

      const route =
        complaint.nextRoutes[i];

      console.log(
        `Checking ${officerType} officer at ${route.stationName}`
      );

      const officer =
        await findOfficer(
          route.stationId,
          complaint.complaintCategory
        );

      // ==================================================
      // OFFICER FOUND
      // ==================================================

      if (officer) {

        console.log(
          `✅ ${officerType} officer found at ${route.stationName}`
        );

        assignedOfficer =
          officer;

        assignedStation =
          route;

        assignedIndex =
          i;

        break;
      }

      // ==================================================
      // OFFICER NOT FOUND
      // ==================================================

      console.log(
        `❌ No ${officerType} officer at ${route.stationName}`
      );

      // ==================================================
      // FIND THE NEXT STATION
      // ==================================================

      const nextStation =
        complaint.nextRoutes[i + 1];

      let automaticMessage;

      if (nextStation) {

        automaticMessage =
          `No suitable ${officerType} officer is available at ${route.stationName}. We are moving your complaint to ${nextStation.stationName}.`;

      } else {

        automaticMessage =
          `No suitable ${officerType} officer is available at ${route.stationName}. There are no more stations available on this route.`;
      }

      // ==================================================
      // ADD DESCRIPTION FOR THIS FAILED STATION
      // ==================================================

      complaint.descriptions.push({

        id:
          `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`,

        who: userType,

        message:
          automaticMessage,

        createdAt:
          new Date(),
      });

      console.log(
        "Description added:",
        automaticMessage
      );
    }

    // ==================================================
    // 7. NO OFFICER FOUND
    // ==================================================

    if (
      !assignedOfficer ||
      !assignedStation
    ) {

      // ==================================================
      // ADD USER'S REASON ALSO
      // ==================================================

      complaint.descriptions.push({

        id:
          `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`,

        who: userType,

        message:
          String(message).trim(),

        createdAt:
          new Date(),
      });

      await complaint.save();

      console.log(
        "❌ No suitable officer found in remaining stations"
      );

      return res.status(404).json({

        success: false,

        message:
          "No suitable officer found in the remaining next stations",

        data:
          complaint,
      });
    }

    // ==================================================
    // 8. SAVE OLD INFORMATION FOR LOGGING
    // ==================================================

    const oldStationName =
      complaint.nextStationName;

    const oldStationId =
      complaint.stationId;

    const oldOfficerId =
      complaint.officerId;

    // ==================================================
    // 9. UPDATE ASSIGNED STATION
    // ==================================================

    complaint.nextStationName =
      assignedStation.stationName;

    complaint.stationId =
      assignedStation.stationId;

    complaint.officerId =
      assignedOfficer._id;

    // ==================================================
    // 10. REMOVE ASSIGNED STATION AND PREVIOUS
    //     STATIONS FROM nextRoutes
    //
    // Example:
    //
    // BEFORE:
    //
    // nextRoutes:
    //
    // Udumalaippettai
    // Madattukulam
    // Pushpattur
    // Palani
    //
    // Officer found:
    // Pushpattur
    //
    // AFTER:
    //
    // nextRoutes:
    //
    // Palani
    // ==================================================

    complaint.nextRoutes =
      complaint.nextRoutes
        .slice(
          assignedIndex + 1
        )
        .map(
          (route) => ({

            stationId:
              route.stationId,

            stationName:
              route.stationName,

          })
        );

    // ==================================================
    // 11. ADD USER'S ORIGINAL MESSAGE
    //
    // This is separate from automatic station
    // movement descriptions.
    // ==================================================

    complaint.descriptions.push({

      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`,

      who: userType,

      message:
        String(message).trim(),

      createdAt:
        new Date(),

    });

    // ==================================================
    // 12. SAVE
    // ==================================================

    await complaint.save();

    // ==================================================
    // 13. LOG
    // ==================================================

    console.log(
      "\n========== COMPLAINT MOVED SUCCESSFULLY =========="
    );

    console.log(
      "Old Station:",
      oldStationName
    );

    console.log(
      "Old Station ID:",
      oldStationId
    );

    console.log(
      "Old Officer ID:",
      oldOfficerId
    );

    console.log(
      "New Station:",
      complaint.nextStationName
    );

    console.log(
      "New Station ID:",
      complaint.stationId
    );

    console.log(
      "New Officer ID:",
      complaint.officerId
    );

    console.log(
      "Remaining Next Routes:",
      complaint.nextRoutes
    );

    console.log(
      "Description Count:",
      complaint.descriptions.length
    );

    // ==================================================
    // 14. RESPONSE
    // ==================================================

    return res.status(200).json({

      success: true,

      message:
        "Complaint moved to next station and assigned successfully",

      data:
        complaint,

    });

  } catch (error) {

    console.error(
      "Move Next Station Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to move complaint to next station",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,

    });
  }
};



// ======================================================
// CHANGE COMPLAINT STATUS: PENDING → ONGOING
// ======================================================


const changePendingToOngoing = async (req, res) => {
  try {
    // ==================================================
    // 1. GET COMPLAINT ID FROM PARAMS
    // ==================================================

    const { complaintId } = req.params;

    // Officer ID comes from request body
   const officerId = req.officer.officerId;

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    if (!officerId) {
      return res.status(400).json({
        success: false,
        message: "Officer ID is required",
      });
    }

    // ==================================================
    // 2. FIND COMPLAINT
    // ==================================================

    const complaint = await Complaint.findById(
      complaintId
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // ==================================================
    // 3. CHECK ASSIGNED OFFICER
    // ==================================================

    if (!complaint.officerId) {
      return res.status(400).json({
        success: false,
        message:
          "No officer is assigned to this complaint",
      });
    }

    // ==================================================
    // 4. VERIFY OFFICER ID
    // ==================================================

    if (
      String(complaint.officerId) !==
      String(officerId)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not the officer assigned to this complaint",
      });
    }

    // ==================================================
    // 5. CHECK CURRENT STATUS
    // ==================================================

    if (complaint.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          `Complaint cannot be changed to ongoing because its current status is "${complaint.status}"`,
      });
    }

    // ==================================================
    // 6. CHANGE STATUS
    // pending → ongoing
    // ==================================================

    complaint.status = "ongoing";

    // ==================================================
    // 7. ADD DESCRIPTION
    // ==================================================

    const description = {
      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`,

      who: "officer",

      message:
        "Your complaint has been taken by the officer. We will try our best to resolve your complaint as soon as possible.",

      createdAt: new Date(),
    };

    // ==================================================
    // 8. PUSH DESCRIPTION INTO EXISTING ARRAY
    // ==================================================

    if (
      !Array.isArray(
        complaint.descriptions
      )
    ) {
      complaint.descriptions = [];
    }

    complaint.descriptions.push(
      description
    );

    // ==================================================
    // 9. SAVE COMPLAINT
    // ==================================================

    await complaint.save();

    // ==================================================
    // 10. RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Complaint status changed from pending to ongoing successfully",

      data: complaint,
    });

  } catch (error) {
    console.error(
      "Change Pending To Ongoing Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to change complaint status",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};


// ======================================================
// GET ALL COMPLAINTS BY STATION ID
// ======================================================

const getComplaintsByStationId = async (req, res) => {
  try {
    // ==================================================
    // 1. GET STATION ID FROM PARAMS
    // ==================================================

    const { stationId } = req.params;

    if (!stationId) {
      return res.status(400).json({
        success: false,
        message: "Station ID is required",
      });
    }

    // ==================================================
    // 2. CHECK WHETHER STATION EXISTS
    // ==================================================

    const station = await Station.findById(stationId);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    // ==================================================
    // 3. FIND ALL COMPLAINTS FOR THIS STATION
    // ==================================================

    const complaints = await Complaint.find({
      stationId: stationId,
    }).sort({
      createdAt: -1,
    });

    // ==================================================
    // 4. RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Complaints retrieved successfully",

      station: {
        stationId: station._id,
        stationName: station.stationName,
        stationCode: station.stationCode,
      },

      count: complaints.length,

      data: complaints,
    });
  } catch (error) {
    console.error(
      "Get Complaints By Station ID Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get complaints for station",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ======================================================
// GET STATION BY STATION ID
// ======================================================

// ======================================================
// GET COMPLAINT BY COMPLAINT ID
// ======================================================

const getComplaintById = async (req, res) => {
  try {
    // ==================================================
    // 1. GET COMPLAINT ID FROM PARAMS
    // ==================================================

    const { complaintId } = req.params;

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    // ==================================================
    // 2. FIND COMPLAINT
    // ==================================================

   const complaint = await Complaint.findOne({
  _id: complaintId,
  userId: req.user.userId,
});

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // ==================================================
    // 3. RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Complaint retrieved successfully",

      data: complaint,
    });
  } catch (error) {
    console.error(
      "Get Complaint By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get complaint",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ======================================================
// GET STATION BY OFFICER ID
// ======================================================

// ======================================================
// GET ALL COMPLAINTS BY OFFICER ID
// ======================================================

const getComplaintsByOfficerId = async (req, res) => {
  try {
    // ==================================================
    // 1. GET OFFICER ID FROM PARAMS
    // ==================================================

    const { officerId } = req.params;

    if (!officerId) {
      return res.status(400).json({
        success: false,
        message: "Officer ID is required",
      });
    }

    // ==================================================
    // 2. FIND OFFICER
    // ==================================================

    const officer = await Officer.findById(
      officerId
    );

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    // ==================================================
    // 3. FIND ALL COMPLAINTS ASSIGNED TO OFFICER
    // ==================================================

    const complaints = await Complaint.find({
      officerId: officerId,
    }).sort({
      createdAt: -1,
    });

    // ==================================================
    // 4. RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Officer complaints retrieved successfully",

      officer: {
        officerId: officer._id,
        officerName: officer.name,
        officerType: officer.officerType,
        stationId: officer.stationId,
      },

      count: complaints.length,

      data: complaints,
    });
  } catch (error) {
    console.error(
      "Get Complaints By Officer ID Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get complaints by officer ID",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// GET ALL COMPLAINTS BY USER ID
// ======================================================

const getComplaintsByUserId = async (req, res) => {
  try {
    // ==================================================
    // 1. GET USER ID FROM PARAMS
    // ==================================================

    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ==================================================
    // 2. FIND ALL COMPLAINTS CREATED BY THIS USER
    // ==================================================

    const complaints = await Complaint.find({
      userId: userId,
    }).sort({
      createdAt: -1,
    });

    // ==================================================
    // 3. CHECK WHETHER COMPLAINTS EXIST
    // ==================================================

    if (complaints.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No complaints found for this user",
        count: 0,
        data: [],
      });
    }

    // ==================================================
    // 4. RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "User complaints retrieved successfully",

      count: complaints.length,

      data: complaints,
    });
  } catch (error) {
    console.error(
      "Get Complaints By User ID Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get complaints by user ID",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// DELETE COMPLAINT
// ======================================================

const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const userId = req.user.userId;

    const complaint = await Complaint.findOne({
      _id: complaintId,
      userId,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await Complaint.findOneAndDelete({
      _id: complaintId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete complaint",
      error: error.message,
    });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "All complaints retrieved successfully",

      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error(
      "Get All Complaints Error:",
      error
    );
  }}
// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createComplaint,
  moveNextStation, 
  changePendingToOngoing,
  getComplaintsByStationId,
  getComplaintById,
  getComplaintsByOfficerId,
  getComplaintsByUserId,
  deleteComplaint,
  getAllComplaints,
};