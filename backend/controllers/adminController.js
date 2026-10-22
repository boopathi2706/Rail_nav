const jwt = require("jsonwebtoken");

const Complaint = require("../models/Complaint");
const Officer = require("../models/Officer");
const Station = require("../models/Station");
const User = require("../models/User");


// ======================================================
// ADMIN LOGIN
// ======================================================

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ------------------------------------------
    // Validate input
    // ------------------------------------------

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // ------------------------------------------
    // Check admin credentials
    // ------------------------------------------

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin username or password",
      });
    }

    // ------------------------------------------
    // Generate JWT
    // ------------------------------------------

    const token = jwt.sign(
      {
        username: process.env.ADMIN_USERNAME,
        role: "admin",
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

    return res.status(200).json({
      success: true,
      message: "Admin login successful",

      data: {
        token,

        admin: {
          username: process.env.ADMIN_USERNAME,
          role: "admin",
        },
      },
    });

  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Admin login failed",
    });
  }
};

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const adminDashboard = async (req, res) => {
  try {
    // ======================================================
    // CURRENT DATE
    // ======================================================

    const now = new Date();

    // ======================================================
    // DATE RANGES
    // ======================================================

    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);

    const last90Days = new Date(now);
    last90Days.setDate(last90Days.getDate() - 90);

    const last180Days = new Date(now);
    last180Days.setDate(last180Days.getDate() - 180);

    const last365Days = new Date(now);
    last365Days.setDate(last365Days.getDate() - 365);

    // ======================================================
    // COMPLAINT COUNTS
    // ======================================================

    const totalComplaintCount = await Complaint.countDocuments();

    // ======================================================
    // SOLVED COMPLAINT COUNT
    // ======================================================

    const solvedComplaintCount = await Complaint.countDocuments({
      status: "solved",
    });

    // ======================================================
    // PENDING COMPLAINT COUNT
    // ======================================================

    const pendingComplaintCount = await Complaint.countDocuments({
      status: "pending",
    });

    // ======================================================
    // IN-PROGRESS COMPLAINT COUNT
    // ======================================================

    const inProgressComplaintCount = await Complaint.countDocuments({
      status: "ongoing",
    });

    // ======================================================
    // COMPLAINTS IN LAST 7 DAYS
    // ======================================================

    const complaintLast7Days = await Complaint.countDocuments({
      createdAt: {
        $gte: last7Days,
        $lte: now,
      },
    });

    // ======================================================
    // COMPLAINTS IN LAST 30 DAYS
    // ======================================================

    const complaintLast30Days = await Complaint.countDocuments({
      createdAt: {
        $gte: last30Days,
        $lte: now,
      },
    });

    // ======================================================
    // COMPLAINTS IN LAST 90 DAYS
    // ======================================================

    const complaintLast90Days = await Complaint.countDocuments({
      createdAt: {
        $gte: last90Days,
        $lte: now,
      },
    });

    // ======================================================
    // COMPLAINTS IN LAST 180 DAYS
    // ======================================================

    const complaintLast180Days = await Complaint.countDocuments({
      createdAt: {
        $gte: last180Days,
        $lte: now,
      },
    });

    // ======================================================
    // COMPLAINTS IN LAST 365 DAYS
    // ======================================================

    const complaintLast365Days = await Complaint.countDocuments({
      createdAt: {
        $gte: last365Days,
        $lte: now,
      },
    });

    // ======================================================
    // TOTAL OFFICERS
    // ======================================================

    const totalOfficerCount = await Officer.countDocuments();

    // ======================================================
    // TOTAL STATIONS
    // ======================================================

    const totalStationCount = await Station.countDocuments();

    // ======================================================
    // TOTAL USERS
    // ======================================================

    const totalUserCount = await User.countDocuments();

    // ======================================================
    // RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data retrieved successfully",

      dashboard: {
        // ----------------------------------------------
        // COMPLAINT SUMMARY
        // ----------------------------------------------

        complaints: {
          total: totalComplaintCount,
          solved: solvedComplaintCount,
          pending: pendingComplaintCount,
          inProgress: inProgressComplaintCount,
        },

        // ----------------------------------------------
        // COMPLAINT DATE SUMMARY
        // ----------------------------------------------

        complaintPeriod: {
          last7Days: complaintLast7Days,
          last30Days: complaintLast30Days,
          last90Days: complaintLast90Days,
          last180Days: complaintLast180Days,
          last365Days: complaintLast365Days,
        },

        // ----------------------------------------------
        // SYSTEM USERS / RESOURCES
        // ----------------------------------------------

        totalOfficers: totalOfficerCount,
        totalStations: totalStationCount,
        totalUsers: totalUserCount,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve admin dashboard data",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


module.exports = {
  adminLogin,
  adminDashboard,
};