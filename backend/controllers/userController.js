const bcrypt = require("bcryptjs");

const User = require("../models/User");
const EmailOTP = require("../models/EmailOTP");
const sendOTPEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const Complaint = require("../models/Complaint");


// ========================================
// REGISTER USER - SEND OTP
// ========================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
    } = req.body;

    // Validate fields
    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phoneNumber },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Hash password before temporary storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete previous OTP request
    await EmailOTP.deleteMany({
      email: email.toLowerCase(),
      purpose: "REGISTER",
    });

    // OTP expires after 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Save temporary registration
    await EmailOTP.create({
      name,
      email: email.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      otp,
      expiresAt,
      purpose: "REGISTER",
    });

    // Send OTP
    await sendOTPEmail(
      email.toLowerCase(),
      otp,
      "Email Verification"
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};


// ========================================
// VERIFY OTP - CREATE USER
// ========================================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP record
    const otpRecord = await EmailOTP.findOne({
      email: email.toLowerCase(),
    });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await EmailOTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check user again
    const existingUser = await User.findOne({
      $or: [
        { email: otpRecord.email },
        { phoneNumber: otpRecord.phoneNumber },
      ],
    });

    if (existingUser) {
      await EmailOTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create actual user
    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      phoneNumber: otpRecord.phoneNumber,
      password: otpRecord.password,
    });

    // Delete OTP after successful verification
    await EmailOTP.deleteOne({
      _id: otpRecord._id,
    });

    res.status(201).json({
      success: true,
      message: "Email verified and user created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        lastUpdatedAt: user.lastUpdatedAt,
      },
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);

    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};





// ========================================
// USER LOGIN
// ========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
          lastUpdatedAt: user.lastUpdatedAt,
        },
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// GET USER PROFILE
// ========================================

const getUserProfile = async (req, res) => {
  try {
    console.log("Fetching profile for userId:", req.user.userId);
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// UPDATE USER
// ========================================

const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      name,
      email,
      phoneNumber,
    } = req.body;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check email already used by another user
    if (email && email.toLowerCase() !== user.email) {

      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      user.email = email.toLowerCase().trim();
    }

    // Check phone already used
    if (phoneNumber && phoneNumber !== user.phoneNumber) {

      const existingPhone = await User.findOne({
        phoneNumber,
        _id: { $ne: userId },
      });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already registered",
        });
      }

      user.phoneNumber = phoneNumber;
    }

    // Update name
    if (name) {
      user.name = name.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",

      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        lastUpdatedAt: user.lastUpdatedAt,
      },
    });

  } catch (error) {
    console.error("Update User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// DELETE USER
// ========================================

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// REQUEST PASSWORD CHANGE OTP
// ========================================

const requestPasswordChange = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { newPassword } = req.body;

    // Validate password
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Delete old password-change OTP
    await EmailOTP.deleteMany({
      email: user.email,
      purpose: "CHANGE_PASSWORD",
    });

    // OTP expires in 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Save OTP
    await EmailOTP.create({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: hashedPassword,
      otp,
      expiresAt,
      purpose: "CHANGE_PASSWORD",
    });

    // Send OTP
    await sendOTPEmail(
      user.email,
      otp,
     "Password Change"
    );

    res.status(200).json({
      success: true,
      message: "Password change OTP sent to your email",
    });

  } catch (error) {
    console.error(
      "Password Change OTP Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// ========================================
// VERIFY PASSWORD CHANGE OTP
// ========================================

const verifyPasswordChange = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find password change OTP
    const otpRecord = await EmailOTP.findOne({
      email: user.email,
      otp,
      purpose: "CHANGE_PASSWORD",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check expiration
    if (new Date() > otpRecord.expiresAt) {

      await EmailOTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Store new password
    user.password = otpRecord.password;

    await user.save();

    // Delete OTP
    await EmailOTP.deleteOne({
      _id: otpRecord._id,
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error(
      "Verify Password Change Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get User by ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// GET USER DASHBOARD DATA
// ======================================================
// Returns:
// 1. Total complaints created by the logged-in user
// 2. Solved complaints
// 3. Pending complaints
// 4. Ongoing / in-progress complaints
//
// User ID comes from JWT middleware:
// req.user.userId
// ======================================================

const getuserDahboardData = async (req, res) => {
  try {
    // ======================================================
    // GET USER ID FROM JWT
    // ======================================================

    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // ======================================================
    // TOTAL COMPLAINTS
    // ======================================================

    const totalComplaintCount = await Complaint.countDocuments({
      userId: userId,
    });

    // ======================================================
    // SOLVED COMPLAINTS
    // ======================================================

    const solvedComplaintCount = await Complaint.countDocuments({
      userId: userId,
      status: "solved",
    });

    // ======================================================
    // PENDING COMPLAINTS
    // ======================================================

    const pendingComplaintCount = await Complaint.countDocuments({
      userId: userId,
      status: "pending",
    });

    // ======================================================
    // ONGOING / IN-PROGRESS COMPLAINTS
    // ======================================================

    const ongoingComplaintCount = await Complaint.countDocuments({
      userId: userId,
      status: "ongoing",
    });

    // ======================================================
    // RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,
      message: "User dashboard data retrieved successfully",

      dashboard: {
        totalComplaintCount: totalComplaintCount,
        solvedComplaintCount: solvedComplaintCount,
        pendingComplaintCount: pendingComplaintCount,
        ongoingComplaintCount: ongoingComplaintCount,
      },
    });
  } catch (error) {
    console.error("Get User Dashboard Data Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user dashboard data",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};



module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
  requestPasswordChange,
  verifyPasswordChange,
  getAllUsers,
  getUserById,
  getuserDahboardData,
};