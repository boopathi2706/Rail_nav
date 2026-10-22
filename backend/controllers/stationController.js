const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Station = require("../models/Station");
const Complaint = require("../models/Complaint");
const Officer = require("../models/Officer");

// ======================================================
// CREATE STATION
// ======================================================

const createStation = async (req, res) => {
  try {
    const {
      stationName,
      stationCode,
      stationPassword,
      stationCategory,
      address,
      coordinates,
      elevation,
    } = req.body;

    // ------------------------------------------
    // Required field validation
    // ------------------------------------------

    if (
      !stationName ||
      !stationCode ||
      !stationPassword ||
      !stationCategory ||
      !address ||
      !coordinates
    ) {
      return res.status(400).json({
        success: false,
        message: "All required station details are required",
      });
    }

    // ------------------------------------------
    // Validate address
    // ------------------------------------------

    if (
      !address.street ||
      !address.city ||
      !address.district ||
      !address.state
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Street, city, district and state are required",
      });
    }

    // ------------------------------------------
    // Validate coordinates
    // ------------------------------------------

    if (
      coordinates.latitude === undefined ||
      coordinates.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // ------------------------------------------
    // Validate station code
    // ------------------------------------------

    const formattedStationCode = stationCode
      .trim()
      .toUpperCase();

    // ------------------------------------------
    // Check duplicate station code
    // ------------------------------------------

    const existingStation = await Station.findOne({
      stationCode: formattedStationCode,
    });

    if (existingStation) {
      return res.status(409).json({
        success: false,
        message: "Station code already exists",
      });
    }

    // ------------------------------------------
    // Hash station password
    // ------------------------------------------

    const hashedPassword = await bcrypt.hash(
      stationPassword,
      10
    );

    // ------------------------------------------
    // Create station
    // ------------------------------------------

    const station = await Station.create({
      stationName: stationName.trim(),

      stationCode: formattedStationCode,

      stationPassword: hashedPassword,

      stationCategory,

      address: {
        street: address.street.trim(),
        city: address.city.trim(),
        district: address.district.trim(),
        state: address.state.trim(),
      },

      coordinates: {
        latitude: Number(coordinates.latitude),
        longitude: Number(coordinates.longitude),
      },

      elevation:
        elevation !== undefined &&
        elevation !== null &&
        elevation !== ""
          ? Number(elevation)
          : null,
    });

    // ------------------------------------------
    // Response
    // ------------------------------------------

    res.status(201).json({
      success: true,
      message: "Station created successfully",

      data: {
        id: station._id,
        stationName: station.stationName,
        stationCode: station.stationCode,
        stationCategory: station.stationCategory,
        address: station.address,
        coordinates: station.coordinates,
        elevation: station.elevation,
        createdAt: station.createdAt,
        lastUpdatedAt: station.lastUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Create Station Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create station",
    });
  }
};


// ======================================================
// STATION LOGIN
// ======================================================

const loginStation = async (req, res) => {
  try {
    const {
      stationCode,
      password,
    } = req.body;

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!stationCode || !password) {
      return res.status(400).json({
        success: false,
        message: "Station code and password are required",
      });
    }

    const formattedStationCode = stationCode
      .trim()
      .toUpperCase();

    // ------------------------------------------
    // Find station
    // ------------------------------------------

    const station = await Station.findOne({
      stationCode: formattedStationCode,
    });

    if (!station) {
      return res.status(401).json({
        success: false,
        message: "Invalid station code or password",
      });
    }

    // ------------------------------------------
    // Compare password
    // ------------------------------------------

    const isPasswordCorrect = await bcrypt.compare(
      password,
      station.stationPassword
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid station code or password",
      });
    }

    // ------------------------------------------
    // Generate JWT
    // ------------------------------------------

    const token = jwt.sign(
      {
        stationId: station._id,
        stationCode: station.stationCode,
        role: "station",
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    // ------------------------------------------
    // Response
    // ------------------------------------------

    res.status(200).json({
      success: true,
      message: "Station login successful",

      data: {
        token,

        station: {
          id: station._id,
          stationName: station.stationName,
          stationCode: station.stationCode,
          stationCategory: station.stationCategory,
          address: station.address,
          coordinates: station.coordinates,
          elevation: station.elevation,
        },
      },
    });
  } catch (error) {
    console.error("Station Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Station login failed",
    });
  }
};


// ======================================================
// GET ALL STATIONS
// ======================================================

const getAllStations = async (req, res) => {
  try {
    const stations = await Station.find()
      .select("-stationPassword")
      .sort({ stationName: 1 });

    res.status(200).json({
      success: true,
      message: "Stations fetched successfully",

      count: stations.length,

      data: stations,
    });
  } catch (error) {
    console.error("Get All Stations Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stations",
    });
  }
};


// ======================================================
// GET ONE STATION
// ======================================================

const getOneStation = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await Station.findById(id)
      .select("-stationPassword");

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Station fetched successfully",

      data: station,
    });
  } catch (error) {
    console.error("Get One Station Error:", error);

    // Invalid MongoDB ID
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch station",
    });
  }
};


// ======================================================
// UPDATE STATION
// ======================================================

const updateStation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      stationName,
      stationCode,
      stationPassword,
      stationCategory,
      address,
      coordinates,
      elevation,
    } = req.body;

    // ------------------------------------------
    // Find station
    // ------------------------------------------

    const station = await Station.findById(id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    // ------------------------------------------
    // Update station name
    // ------------------------------------------

    if (stationName) {
      station.stationName = stationName.trim();
    }

    // ------------------------------------------
    // Update station code
    // ------------------------------------------

    if (stationCode) {
      const formattedStationCode = stationCode
        .trim()
        .toUpperCase();

      const existingStation = await Station.findOne({
        stationCode: formattedStationCode,
        _id: { $ne: id },
      });

      if (existingStation) {
        return res.status(409).json({
          success: false,
          message: "Station code already exists",
        });
      }

      station.stationCode = formattedStationCode;
    }

    // ------------------------------------------
    // Update station password
    // ------------------------------------------

    if (stationPassword) {
      if (stationPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Station password must be at least 6 characters",
        });
      }

      station.stationPassword =
        await bcrypt.hash(
          stationPassword,
          10
        );
    }

    // ------------------------------------------
    // Update category
    // ------------------------------------------

    if (stationCategory) {
      station.stationCategory =
        stationCategory;
    }

    // ------------------------------------------
    // Update address
    // ------------------------------------------

    if (address) {
      if (address.street !== undefined) {
        station.address.street =
          address.street.trim();
      }

      if (address.city !== undefined) {
        station.address.city =
          address.city.trim();
      }

      if (address.district !== undefined) {
        station.address.district =
          address.district.trim();
      }

      if (address.state !== undefined) {
        station.address.state =
          address.state.trim();
      }
    }

    // ------------------------------------------
    // Update coordinates
    // ------------------------------------------

    if (coordinates) {
      if (coordinates.latitude !== undefined) {
        station.coordinates.latitude =
          Number(coordinates.latitude);
      }

      if (coordinates.longitude !== undefined) {
        station.coordinates.longitude =
          Number(coordinates.longitude);
      }
    }

    // ------------------------------------------
    // Update elevation
    // ------------------------------------------

    if (elevation !== undefined) {
      station.elevation =
        elevation === null || elevation === ""
          ? null
          : Number(elevation);
    }

    // ------------------------------------------
    // Save
    // ------------------------------------------

    await station.save();

    // ------------------------------------------
    // Response
    // ------------------------------------------

    res.status(200).json({
      success: true,
      message: "Station updated successfully",

      data: {
        id: station._id,
        stationName: station.stationName,
        stationCode: station.stationCode,
        stationCategory: station.stationCategory,
        address: station.address,
        coordinates: station.coordinates,
        elevation: station.elevation,
        createdAt: station.createdAt,
        lastUpdatedAt: station.lastUpdatedAt,
      },
    });
  } catch (error) {
    console.error("Update Station Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update station",
    });
  }
};


// ======================================================
// DELETE STATION
// ======================================================

const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await Station.findById(id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    await Station.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Station deleted successfully",
    });
  } catch (error) {
    console.error("Delete Station Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete station",
    });
  }
};

const getdashboarddata = async (req, res) => {
  try {
    const { stationId } = req.params;

    // ======================================================
    // VALIDATE STATION ID
    // ======================================================

    if (!stationId) {
      return res.status(400).json({
        success: false,
        message: "Station ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(stationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid station ID",
      });
    }

    // ======================================================
    // CHECK STATION EXISTS
    // ======================================================

    const station = await Station.findById(stationId).lean();

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    // ======================================================
    // TOTAL COMPLAINT COUNT
    // ======================================================

    const totalComplaintCount = await Complaint.countDocuments({
      stationId: stationId,
    });

    // ======================================================
    // TOTAL SOLVED COMPLAINT COUNT
    // ======================================================

    const solvedComplaintCount = await Complaint.countDocuments({
      stationId: stationId,
      status: "solved",
    });

    // ======================================================
    // TOTAL PENDING COMPLAINT COUNT
    // ======================================================

    const pendingComplaintCount = await Complaint.countDocuments({
      stationId: stationId,
      status: "pending",
    });

    // ======================================================
    // TOTAL IN-PROGRESS COMPLAINT COUNT
    // ======================================================
    // In-progress = ongoing
    // ======================================================

    const inProgressComplaintCount = await Complaint.countDocuments({
      stationId: stationId,
      status: "ongoing",
    });

    // ======================================================
    // GET OFFICERS BASED ON STATION ID
    // ======================================================

    const officers = await Officer.find({
      stationId: stationId,
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // ======================================================
    // TOTAL OFFICER COUNT
    // ======================================================

    const totalOfficerCount = officers.length;

    // ======================================================
    // RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "Station dashboard data retrieved successfully",

      // ====================================================
      // STATION DETAILS
      // ====================================================

      station: station,

      // ====================================================
      // DASHBOARD COUNTS
      // ====================================================

      dashboard: {
        totalComplaintCount: totalComplaintCount,
        solvedComplaintCount: solvedComplaintCount,
        pendingComplaintCount: pendingComplaintCount,
        inProgressComplaintCount: inProgressComplaintCount,
        totalOfficerCount: totalOfficerCount,
      },

      // ====================================================
      // OFFICER DETAILS
      // ====================================================

      officers: officers,
    });
  } catch (error) {
    console.error("Get Station Dashboard Data Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve station dashboard data",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};





// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createStation,
  loginStation,
  getAllStations,
  getOneStation,
  updateStation,
  deleteStation,
  getdashboarddata,
};