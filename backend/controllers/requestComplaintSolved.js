const Complaint = require("../models/Complaint");
const SolvedComplaintRequest = require(
  "../models/SolvedComplaintRequest"
);
const Officer = require("../models/Officer");
const User = require("../models/User");

const uploadToCloudinary = require(
  "../utils/cloudinaryUpload"
);

const nodemailer = require("nodemailer");

// ======================================================
// EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
  }
});

// ======================================================
// REQUEST COMPLAINT SOLVED
//
// Officer submits solved evidence.
//
// IMPORTANT:
// Complaint status is NOT changed here.
//
// ongoing
//    ↓
// solved request created
//    ↓
// user reviews evidence
//    ↓
// user accepts
//    ↓
// complaint becomes solved
// ======================================================

const requestComplaintSolved = async (
  req,
  res
) => {
  try {

    // ==================================================
    // 1. GET DATA FROM REQUEST BODY
    // ==================================================

    const {
      complaintId,
      officerId,
    } = req.body;


    // ==================================================
    // 2. VALIDATE BASIC DATA
    // ==================================================

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
    // 3. CHECK FILES
    // ==================================================

    const imageFiles =
      req.files?.images || [];

    const videoFiles =
      req.files?.videos || [];


    if (
      imageFiles.length === 0 &&
      videoFiles.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one solved evidence image or video is required",
      });
    }


    // ==================================================
    // 4. FIND OFFICER
    // ==================================================

    const officer =
      await Officer.findById(
        officerId
      );

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }


    // ==================================================
    // 5. FIND COMPLAINT
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
    // 6. VERIFY ASSIGNED OFFICER
    //
    // Only the officer currently assigned to the
    // complaint can submit solved evidence.
    // ==================================================

    if (
      String(complaint.officerId) !==
      String(officerId)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This complaint is not assigned to this officer",
      });
    }


    // ==================================================
    // 7. CHECK COMPLAINT STATUS
    //
    // Officer can request solved only when complaint
    // is currently ongoing.
    // ==================================================

    if (
      complaint.status !== "ongoing"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Solved request cannot be created because complaint status is "${complaint.status}"`,
      });
    }


    // ==================================================
    // 8. FIND USER
    // ==================================================

    const user =
      await User.findById(
        complaint.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User associated with this complaint was not found",
      });
    }


    // ==================================================
    // 9. CHECK EXISTING PENDING REQUEST
    //
    // Prevent officer from creating multiple pending
    // solved requests for the same complaint.
    // ==================================================

    const existingRequest =
      await SolvedComplaintRequest.findOne({
        complaintId:
          complaint._id,

        status:
          "pending",
      });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message:
          "A solved approval request is already pending for this complaint",
        data: existingRequest,
      });
    }


    // ==================================================
    // 10. UPLOAD SOLVED IMAGES
    // ==================================================

    const solvedImages = [];

    for (
      const file of imageFiles
    ) {

      try {

        console.log(
          "Uploading solved IMAGE:",
          {
            name:
              file.originalname,

            mimetype:
              file.mimetype,

            size:
              file.size,
          }
        );


        const result =
          await uploadToCloudinary(
            file.buffer,

            "rail-nav/complaints/solved/images",

            "image"
          );


        console.log(
          "Solved IMAGE uploaded:",
          result.secure_url
        );


        solvedImages.push(
          result.secure_url
        );

      } catch (error) {

        console.error(
          "Solved IMAGE upload error:",
          error
        );

        throw new Error(
          "Failed to upload solved evidence image"
        );
      }
    }


    // ==================================================
    // 11. UPLOAD SOLVED VIDEOS
    // ==================================================

    const solvedVideos = [];

    for (
      const file of videoFiles
    ) {

      try {

        console.log(
          "Uploading solved VIDEO:",
          {
            name:
              file.originalname,

            mimetype:
              file.mimetype,

            size:
              file.size,
          }
        );


        const result =
          await uploadToCloudinary(
            file.buffer,

            "rail-nav/complaints/solved/videos",

            "video"
          );


        console.log(
          "Solved VIDEO uploaded:",
          result.secure_url
        );


        solvedVideos.push(
          result.secure_url
        );

      } catch (error) {

        console.error(
          "Solved VIDEO upload error:",
          error
        );

        throw new Error(
          "Failed to upload solved evidence video"
        );
      }
    }


    // ==================================================
    // 12. CREATE SOLVED REQUEST
    //
    // IMPORTANT:
    // Complaint itself is NOT modified here.
    // ==================================================

    const solvedRequest =
      await SolvedComplaintRequest.create({

        userId:
          complaint.userId,

        complaintId:
          complaint._id,

        officerId:
          officer._id,

        solvedProof: {

          images:
            solvedImages,

          videos:
            solvedVideos,
        },

        status:
          "pending",

        respondedAt:
          null,
      });


    // ==================================================
    // 13. ADD DESCRIPTION TO COMPLAINT
    // ==================================================

    if (
      !Array.isArray(
        complaint.descriptions
      )
    ) {
      complaint.descriptions = [];
    }


    const description = {

      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`,

      who:
        "officer",

      message:
        "The officer has solved your complaint and submitted the solved evidence. Please check the evidence and accept the resolution if the issue has been resolved.",

      createdAt:
        new Date(),
    };


    complaint.descriptions.push(
      description
    );


    // ==================================================
    // 14. SAVE COMPLAINT
    //
    // Only description is updated.
    //
    // complaint.status remains:
    // "ongoing"
    // ==================================================

    await complaint.save();


    // ==================================================
    // 15. SEND EMAIL TO USER
    // ==================================================

    if (user.email) {

      const imageLinks =
        solvedImages
          .map(
            (url, index) =>
              `
              <div style="margin-bottom:20px;">
                <p>
                  <strong>
                    Solved Evidence Image ${index + 1}
                  </strong>
                </p>

                <a
                  href="${url}"
                  target="_blank"
                  style="
                    display:inline-block;
                    padding:10px 18px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                  "
                >
                  View Image
                </a>
              </div>
              `
          )
          .join("");


      const videoLinks =
        solvedVideos
          .map(
            (url, index) =>
              `
              <div style="margin-bottom:20px;">
                <p>
                  <strong>
                    Solved Evidence Video ${index + 1}
                  </strong>
                </p>

                <a
                  href="${url}"
                  target="_blank"
                  style="
                    display:inline-block;
                    padding:10px 18px;
                    background:#16a34a;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                  "
                >
                  View Video
                </a>
              </div>
              `
          )
          .join("");


      const mailOptions = {

        from:
          `"Rail Nav" <${process.env.EMAIL_USER}>`,

        to:
          user.email,

        subject:
          "Rail Nav - Complaint Resolution Request",


        html: `
          <!DOCTYPE html>

          <html>

          <body
            style="
              margin:0;
              padding:0;
              background:#f4f6f8;
              font-family:Arial,sans-serif;
            "
          >

            <div
              style="
                max-width:650px;
                margin:30px auto;
                background:white;
                border-radius:12px;
                overflow:hidden;
                box-shadow:0 4px 15px rgba(0,0,0,0.08);
              "
            >

              <!-- HEADER -->

              <div
                style="
                  background:#1d4ed8;
                  color:white;
                  padding:25px;
                  text-align:center;
                "
              >

                <h1
                  style="
                    margin:0;
                    font-size:26px;
                  "
                >
                  Rail Nav
                </h1>

                <p
                  style="
                    margin:8px 0 0;
                  "
                >
                  Complaint Resolution Update
                </p>

              </div>


              <!-- CONTENT -->

              <div
                style="
                  padding:30px;
                  color:#333;
                "
              >

                <h2>
                  Hello ${user.name || "User"},
                </h2>


                <p>
                  The officer assigned to your complaint
                  has completed the requested work and
                  submitted evidence for the resolution.
                </p>


                <p>
                  Please check the evidence below and
                  accept the resolution if your complaint
                  has been successfully resolved.
                </p>


                <div
                  style="
                    background:#f8fafc;
                    padding:18px;
                    border-radius:8px;
                    margin:20px 0;
                  "
                >

                  <p>
                    <strong>Complaint ID:</strong>
                    ${complaint._id}
                  </p>

                  <p>
                    <strong>PNR Number:</strong>
                    ${complaint.pnrNumber}
                  </p>

                  <p>
                    <strong>Train Number:</strong>
                    ${complaint.trainNumber}
                  </p>

                  <p>
                    <strong>Category:</strong>
                    ${complaint.complaintCategory}
                  </p>

                </div>


                <h3>
                  Solved Evidence
                </h3>


                ${imageLinks}

                ${videoLinks}


                <div
                  style="
                    margin-top:25px;
                    padding:15px;
                    background:#fff7ed;
                    border-left:4px solid #f97316;
                  "
                >

                  <strong>
                    Important:
                  </strong>

                  <p style="margin-bottom:0;">
                    Your complaint has not been marked
                    as solved yet. It will be marked as
                    solved only after you review and
                    accept the resolution.
                  </p>

                </div>


                <p
                  style="
                    margin-top:30px;
                  "
                >
                  Thank you for using Rail Nav.
                </p>

              </div>


              <!-- FOOTER -->

              <div
                style="
                  background:#f8fafc;
                  padding:18px;
                  text-align:center;
                  color:#64748b;
                  font-size:13px;
                "
              >

                Rail Nav Railway Complaint Management System

              </div>

            </div>

          </body>

          </html>
        `,
      };


      try {

        await transporter.sendMail(
          mailOptions
        );

        console.log(
          "Solved complaint email sent successfully to:",
          user.email
        );

      } catch (emailError) {

        console.error(
          "Solved complaint email error:",
          emailError
        );

        // Do not fail the entire request because
        // the solved request has already been created.
      }
    }


    // ==================================================
    // 16. RESPONSE
    // ==================================================

    return res.status(201).json({

      success:
        true,

      message:
        "Complaint solved request created successfully. Waiting for user acceptance.",

      data: {

        request:
          solvedRequest,

        complaint: {
          complaintId:
            complaint._id,

          status:
            complaint.status,

          officerId:
            complaint.officerId,

          description:
            description,
        },

      },

    });

  } catch (error) {

    // ==================================================
    // ERROR HANDLING
    // ==================================================

    console.error(
      "Request Complaint Solved Error:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        "Failed to create complaint solved request",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,

    });
  }
};


// ======================================================
// ACCEPT COMPLAINT SOLVED REQUEST
// USER ACCEPTS OFFICER'S SOLVED REQUEST
// ======================================================

const acceptComplaintSolved = async (req, res) => {
  try {
    // ==================================================
    // 1. GET DATA FROM REQUEST BODY
    // ==================================================

    const {
      complaintId,
      solvedLink,
    } = req.body;
    console.log(
      "Accept solved request body:",
      req.body
    );

    // ==================================================
    // 2. VALIDATE COMPLAINT ID
    // ==================================================

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    // ==================================================
    // 3. VALIDATE SOLVED LINK
    // ==================================================

    if (!solvedLink) {
      return res.status(400).json({
        success: false,
        message: "Solved link is required",
      });
    }

    // ==================================================
    // 4. FIND COMPLAINT
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
    // 5. CHECK COMPLAINT STATUS
    //
    // Only ONGOING complaints can be accepted.
    // ==================================================

    if (
      complaint.status !== "ongoing"
    ) {
      return res.status(409).json({
        success: false,
        message:
          `Complaint cannot be accepted because its current status is "${complaint.status}"`,
      });
    }

    // ==================================================
    // 6. FIND SOLVED REQUEST
    //
    // Match:
    // complaintId
    // solvedLink
    // ==================================================

    const solvedRequest =
      await SolvedComplaintRequest.findOne({
        complaintId:
          complaint._id,

        $or: [
          {
            "solvedProof.images":
              solvedLink,
          },
          {
            "solvedProof.videos":
              solvedLink,
          },
        ],
      });

    // ==================================================
    // 7. SOLVED REQUEST NOT FOUND
    // ==================================================

    if (!solvedRequest) {
      return res.status(404).json({
        success: false,
        message:
          "Solved approval request or solved evidence link not found",
      });
    }

    // ==================================================
    // 8. VERIFY USER
    //
    // The solved request must belong to the
    // same user who owns the complaint.
    // ==================================================

    if (
      solvedRequest.userId &&
      complaint.userId &&
      String(
        solvedRequest.userId
      ) !==
        String(
          complaint.userId
        )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This solved request does not belong to the complaint user",
      });
    }

    // ==================================================
    // 9. GET SOLVED EVIDENCE
    // ==================================================

    const solvedImages =
      Array.isArray(
        solvedRequest
          .solvedProof?.images
      )
        ? solvedRequest
            .solvedProof.images
        : [];

    const solvedVideos =
      Array.isArray(
        solvedRequest
          .solvedProof?.videos
      )
        ? solvedRequest
            .solvedProof.videos
        : [];

    // ==================================================
    // 10. VERIFY SOLVED LINK EXISTS
    // ==================================================

    const imageExists =
      solvedImages.includes(
        solvedLink
      );

    const videoExists =
      solvedVideos.includes(
        solvedLink
      );

    if (
      !imageExists &&
      !videoExists
    ) {
      return res.status(404).json({
        success: false,
        message:
          "The provided solved evidence link does not belong to this request",
      });
    }

    // ==================================================
    // 11. UPDATE COMPLAINT SOLVED PROOF
    //
    // Store all evidence from the approved request.
    // ==================================================

    complaint.solvedProof = {
      images: solvedImages,
      videos: solvedVideos,
    };

    // ==================================================
    // 12. CHANGE STATUS
    //
    // ONGOING → SOLVED
    // ==================================================

    complaint.status = "solved";

    // ==================================================
    // 13. SOLVED DATE TIME
    // ==================================================

    complaint.solvedDateTime =
      new Date();

    // ==================================================
    // 14. ADD DESCRIPTION
    // ==================================================

    const description = {
      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`,

      who: "user",

      message:
        "The user has checked and accepted the complaint. The complaint is now marked as solved.",

      createdAt:
        new Date(),
    };

    // ==================================================
    // 15. PUSH DESCRIPTION
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
    // 16. SAVE COMPLAINT
    // ==================================================

    await complaint.save();

    // ==================================================
    // 17. DELETE SOLVED REQUEST
    //
    // The approval request has now been completed,
    // so it is no longer pending.
    // ==================================================

    await SolvedComplaintRequest.findByIdAndDelete(
      solvedRequest._id
    );

    // ==================================================
    // 18. RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Complaint accepted and marked as solved successfully",

      data: complaint,
    });

  } catch (error) {

    // ==================================================
    // ERROR
    // ==================================================

    console.error(
      "Accept Complaint Solved Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to accept solved complaint",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

const checkComplaintSolvedRequest = async (req, res) => {
  try {
    const { complaintId } = req.query;

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    const existingRequest =
      await SolvedComplaintRequest.findOne({
        complaintId,
        status: "pending",
      });

    return res.status(200).json({
      success: true,
      exists: !!existingRequest,
      data: existingRequest || null,
    });
  } catch (error) {
    console.error(
      "Check Solved Complaint Request Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to check solved request",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  requestComplaintSolved,
  acceptComplaintSolved,
  checkComplaintSolvedRequest,
};