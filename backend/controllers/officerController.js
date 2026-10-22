const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Officer = require("../models/Officer");
const Station = require("../models/Station");
const Complaint = require("../models/Complaint");
const mongoose = require("mongoose");


// ======================================================
// CREATE OFFICER
// ======================================================

const createOfficer = async (req, res) => {
  try {
    const {
      name,
      email,
      officerType,
      password,
      phoneNumber,
      stationCode,
    } = req.body;

    // ==================================================
    // 1. VALIDATE REQUIRED FIELDS
    // ==================================================

    if (
      !name ||
      !email ||
      !officerType ||
      !password ||
      !phoneNumber ||
      !stationCode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, officer type, password, phone number and station code are required",
      });
    }

    // ==================================================
    // 2. NORMALIZE DATA
    // ==================================================

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedOfficerType =
      officerType.trim().toLowerCase();

    // Station code MUST be uppercase
    const normalizedStationCode =
      stationCode.trim().toUpperCase();

    // ==================================================
    // 3. VALIDATE PASSWORD
    // ==================================================

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // ==================================================
    // 4. CHECK OFFICER TYPE
    // ==================================================

    const validOfficerTypes = [
      "electric",
      "water",
      "cleaning",
      "ttr",
      "others",
    ];

    if (
      !validOfficerTypes.includes(
        normalizedOfficerType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid officer type. Valid types are electric, water, cleaning, ttr and others",
      });
    }

    // ==================================================
    // 5. FIND STATION USING STATION CODE
    // ==================================================

    const station =
      await Station.findOne({
        stationCode:
          normalizedStationCode,
      });

    if (!station) {
      return res.status(404).json({
        success: false,
        message:
          `Station not found with station code "${normalizedStationCode}"`,
      });
    }

    console.log(
      "Station found:",
      station.stationName
    );

    console.log(
      "Station ID:",
      station._id
    );

    // ==================================================
    // 6. CHECK EXISTING OFFICER EMAIL
    // ==================================================

    const existingOfficer =
      await Officer.findOne({
        email: normalizedEmail,
      });

    if (existingOfficer) {
      return res.status(409).json({
        success: false,
        message:
          "Officer email already exists",
      });
    }

    // ==================================================
    // 7. HASH PASSWORD
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // ==================================================
    // 8. CREATE OFFICER
    // ==================================================

    const officer =
      await Officer.create({
        name: name.trim(),

        email: normalizedEmail,

        officerType:
          normalizedOfficerType,

        password:
          hashedPassword,

        phoneNumber:
          phoneNumber.trim(),

        // IMPORTANT:
        // Save station _id, NOT station code
        stationId:
          station._id,
      });

    // ==================================================
    // 9. RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,

      message:
        "Officer created successfully",

      data: {
        id: officer._id,

        name:
          officer.name,

        email:
          officer.email,

        officerType:
          officer.officerType,

        phoneNumber:
          officer.phoneNumber,

        // Officer database stores station ID
        stationId:
          officer.stationId,

        // Also return station information
        station: {
          stationId:
            station._id,

          stationCode:
            station.stationCode,

          stationName:
            station.stationName,
        },

        createdAt:
          officer.createdAt,

        updatedAt:
          officer.updatedAt,
      },
    });

  } catch (error) {
    console.error(
      "Create Officer Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create officer",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};


// ======================================================
// OFFICER LOGIN
// ======================================================

const loginOfficer = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ------------------------------------------
    // Validate
    // ------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ------------------------------------------
    // Find officer
    // ------------------------------------------

    const officer = await Officer.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!officer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ------------------------------------------
    // Compare password
    // ------------------------------------------

    const passwordMatch = await bcrypt.compare(
      password,
      officer.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ------------------------------------------
    // Generate JWT
    // ------------------------------------------

    const token = jwt.sign(
      {
        officerId: officer._id,
        email: officer.email,
        officerType: officer.officerType,
        stationId: officer.stationId,
        role: "officer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    // ------------------------------------------
    // Response
    // ------------------------------------------
   const stationName=await Station.findById(officer.stationId).select("stationName");
    res.status(200).json({
      success: true,
      message: "Officer login successful",

      data: {
        token,

        officer: {
          id: officer._id,
          name: officer.name,
          email: officer.email,
          officerType: officer.officerType,
          phoneNumber: officer.phoneNumber,
          stationId: officer.stationId,
          stationName: stationName,
        },
      },
    });

  } catch (error) {
    console.error(
      "Officer Login Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Officer login failed",
    });
  }
};


// ======================================================
// GET OFFICER PROFILE
// ======================================================

const getOfficerProfile = async (req, res) => {
  try {
    const officer = await Officer.findById(
      req.officer.officerId
    )
      .select("-password")
      .populate(
        "stationId",
        "stationName stationCode stationCategory address coordinates"
      );

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Officer profile fetched successfully",
      data: officer,
    });

  } catch (error) {
    console.error(
      "Get Officer Profile Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch officer profile",
    });
  }
};


// ======================================================
// GET OFFICER STATION
// ======================================================

const getOfficerStation = async (req, res) => {
  try {
    const officer = await Officer.findById(
      req.officer.officerId
    ).select("stationId");

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    const station = await Station.findById(
      officer.stationId
    ).select("-stationPassword");

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Officer station fetched successfully",
      data: station,
    });

  } catch (error) {
    console.error(
      "Get Officer Station Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch officer station",
    });
  }
};


// ======================================================
// UPDATE OFFICER
// ======================================================

const updateOfficer = async (req, res) => {
  try {
    const {
      name,
      email,
      officerType,
      phoneNumber,
      stationId,
    } = req.body;

    const officer = await Officer.findById(
      req.officer.officerId
    );

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    // ------------------------------------------
    // Update name
    // ------------------------------------------

    if (name) {
      officer.name = name.trim();
    }

    // ------------------------------------------
    // Update email
    // ------------------------------------------

    if (email) {
      const newEmail = email
        .toLowerCase()
        .trim();

      const existingOfficer =
        await Officer.findOne({
          email: newEmail,
          _id: {
            $ne: officer._id,
          },
        });

      if (existingOfficer) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      officer.email = newEmail;
    }

    // ------------------------------------------
    // Update officer type
    // ------------------------------------------

    if (officerType) {
      const validOfficerTypes = [
        "electric",
        "water",
        "cleaning",
        "ttr",
        "others",
      ];

      if (
        !validOfficerTypes.includes(
          officerType.toLowerCase()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid officer type",
        });
      }

      officer.officerType =
        officerType.toLowerCase();
    }

    // ------------------------------------------
    // Update phone
    // ------------------------------------------

    if (phoneNumber) {
      officer.phoneNumber =
        phoneNumber.trim();
    }

    // ------------------------------------------
    // Update station
    // ------------------------------------------

    if (stationId) {
      const station = await Station.findById(
        stationId
      );

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "New station not found",
        });
      }

      officer.stationId = station._id;
    }

    await officer.save();

    res.status(200).json({
      success: true,
      message: "Officer updated successfully",

      data: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        officerType: officer.officerType,
        phoneNumber: officer.phoneNumber,
        stationId: officer.stationId,
        createdAt: officer.createdAt,
        updatedAt: officer.updatedAt,
      },
    });

  } catch (error) {
    console.error(
      "Update Officer Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update officer",
    });
  }
};

const updateOfficerbyAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      officerType,
      phoneNumber,
      stationId,
    } = req.body;
    const { id } = req.params;

    const officer = await Officer.findById(
      id
    );

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    // ------------------------------------------
    // Update name
    // ------------------------------------------

    if (name) {
      officer.name = name.trim();
    }

    // ------------------------------------------
    // Update email
    // ------------------------------------------

    if (email) {
      const newEmail = email
        .toLowerCase()
        .trim();

      const existingOfficer =
        await Officer.findOne({
          email: newEmail,
          _id: {
            $ne: officer._id,
          },
        });

      if (existingOfficer) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      officer.email = newEmail;
    }

    // ------------------------------------------
    // Update officer type
    // ------------------------------------------

    if (officerType) {
      const validOfficerTypes = [
        "electric",
        "water",
        "cleaning",
        "ttr",
        "others",
      ];

      if (
        !validOfficerTypes.includes(
          officerType.toLowerCase()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid officer type",
        });
      }

      officer.officerType =
        officerType.toLowerCase();
    }

    // ------------------------------------------
    // Update phone
    // ------------------------------------------

    if (phoneNumber) {
      officer.phoneNumber =
        phoneNumber.trim();
    }

    // ------------------------------------------
    // Update station
    // ------------------------------------------

    if (stationId) {
      const station = await Station.findById(
        stationId
      );

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "New station not found",
        });
      }

      officer.stationId = station._id;
    }

    await officer.save();

    res.status(200).json({
      success: true,
      message: "Officer updated successfully",

      data: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        officerType: officer.officerType,
        phoneNumber: officer.phoneNumber,
        stationId: officer.stationId,
        createdAt: officer.createdAt,
        updatedAt: officer.updatedAt,
      },
    });

  } catch (error) {
    console.error(
      "Update Officer Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update officer",
    });
  }
};
// ======================================================
// DELETE OFFICER
// ======================================================

const deleteOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const officer = await Officer.findById(id);

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

   await Officer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Officer deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Officer Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete officer",
    });
  }
};

const getAllOfficers = async (req, res) => {
  try {
    const officers = await Officer.find().select(
      "-password"
    );
    res.status(200).json({
      success: true,
      message: "All officers retrieved successfully",
      data: officers,
    });
  }
  catch (error) {
    console.error(
      "Get All Officers Error:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to retrieve officers",
      error:

        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
// ======================================================
// CHANGE PASSWORD
// ======================================================

const changeOfficerPassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    // ------------------------------------------
    // Validate
    // ------------------------------------------

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    // ------------------------------------------
    // Password length
    // ------------------------------------------

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    // ------------------------------------------
    // Find officer
    // ------------------------------------------

    const officer = await Officer.findById(
      req.officer.officerId
    );

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    // ------------------------------------------
    // Check current password
    // ------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        officer.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // ------------------------------------------
    // Prevent same password
    // ------------------------------------------

    const samePassword =
      await bcrypt.compare(
        newPassword,
        officer.password
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    // ------------------------------------------
    // Hash new password
    // ------------------------------------------

    officer.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await officer.save();

    res.status(200).json({
      success: true,
      message:
        "Officer password changed successfully",
    });

  } catch (error) {
    console.error(
      "Change Officer Password Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to change officer password",
    });
  }
};


// ======================================================
// GET ALL COMPLAINTS BY OFFICER ID
// ======================================================

const getComplaintsByOfficerId = async (req, res) => {
  try {
    // ==================================================
    // 1. GET OFFICER ID FROM PARAMS
    // ==================================================

   const officerId = req.officer.officerId;
    if (!officerId) {
      return res.status(400).json({
        success: false,
        message: "Officer ID is required",
      });
    }

    // ==================================================
    // 2. VALIDATE OFFICER ID
    // ==================================================

    if (!mongoose.Types.ObjectId.isValid(officerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid officer ID",
      });
    }

    // ==================================================
    // 3. FIND OFFICER
    // ==================================================

    const officer = await Officer.findById(officerId);

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    // ==================================================
    // 4. FIND ALL COMPLAINTS ASSIGNED TO OFFICER
    // ==================================================

    const complaints = await Complaint.find({
      officerId: officerId,
    }).sort({
      createdAt: -1,
    });

    // ==================================================
    // 5. RESPONSE
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
// OFFICER DASHBOARD DATA
// ======================================================
// Returns:
// 1. Total complaint count
// 2. Total solved complaint count
// 3. Total in-progress complaint count
// 4. Top 5 recent complaints
//
// Officer ID is received through req.params
// ======================================================

const officerDashboarddata = async (req, res) => {
  try {
   const officerId = req.officer.officerId;

    // ======================================================
    // VALIDATE OFFICER ID
    // ======================================================

    if (!officerId) {
      return res.status(400).json({
        success: false,
        message: "Officer ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(officerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid officer ID",
      });
    }

    // ======================================================
    // CHECK OFFICER EXISTS
    // ======================================================

    const officer = await Officer.findById(officerId).select(
      "name email officerType phoneNumber stationId"
    );

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    // ======================================================
    // TOTAL COMPLAINT COUNT
    // ======================================================

    const totalComplaintCount = await Complaint.countDocuments({
      officerId: officerId,
    });

    // ======================================================
    // TOTAL SOLVED COMPLAINT COUNT
    // ======================================================

    const totalSolvedComplaintCount = await Complaint.countDocuments({
      officerId: officerId,
      status: "solved",
    });

    // ======================================================
    // TOTAL IN-PROGRESS COMPLAINT COUNT
    // ======================================================
    // Here "in-progress" means status = "ongoing"
    // ======================================================

    const totalInProgressComplaintCount = await Complaint.countDocuments({
      officerId: officerId,
      status: "ongoing",
    });

    // ======================================================
    // TOP 5 RECENT COMPLAINTS
    // ======================================================
    // Sort by createdAt descending
    // Latest complaint will come first
    // ======================================================

    const recentComplaints = await Complaint.find({
      officerId: officerId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "userName pnrNumber trainNumber incidentDateTime complaintCategory status nextStationName stationId officerId evidenceProof solvedProof createdAt updatedAt"
      )
      .lean();

    // ======================================================
    // RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "Officer dashboard data retrieved successfully",

      officer: {
        officerId: officer._id,
        officerName: officer.name,
        email: officer.email,
        officerType: officer.officerType,
        phoneNumber: officer.phoneNumber,
        stationId: officer.stationId,
      },

      dashboard: {
        totalComplaintCount: totalComplaintCount,
        totalSolvedComplaintCount: totalSolvedComplaintCount,
        totalInProgressComplaintCount: totalInProgressComplaintCount,
      },

      recentComplaints: recentComplaints,
    });
  } catch (error) {
    console.error("Officer Dashboard Data Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve officer dashboard data",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  officerDashboarddata,
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createOfficer,
  loginOfficer,
  getOfficerProfile,
  getOfficerStation,
  updateOfficer,
  updateOfficerbyAdmin,
  deleteOfficer,
  getAllOfficers,
  changeOfficerPassword,
  getComplaintsByOfficerId,
  officerDashboarddata,
};