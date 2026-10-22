const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/userController");
const {
  userForgotPassword,
  verifyUserForgotPassword,
} = require("../controllers/forgotPasswordController");
const protect = require("../middlewares/authMiddleware");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");

console.log("userForgotPassword:", userForgotPassword);
console.log("verifyUserForgotPassword:", verifyUserForgotPassword);

// Register + send OTP
router.post("/register", registerUser);

// Verify OTP + create user
router.post("/verify-otp", verifyOTP);

// Login user
router.post("/login", loginUser);

// ========================================
// PROTECTED ROUTES
// ========================================

// Get logged-in user
router.get("/profile", protect, getUserProfile);

// Update logged-in user
router.put("/update", protect, updateUser);

// Delete logged-in user


// ================================
// PASSWORD CHANGE
// ================================

router.post("/change-password/request", protect, requestPasswordChange);

router.post("/change-password/verify", protect, verifyPasswordChange);

router.post("/forgot-password", userForgotPassword);
router.post("/verify-forgot-password", verifyUserForgotPassword);
router.get("/all-users", adminAuthMiddleware, getAllUsers);
router.get("/user/:id", adminAuthMiddleware, getUserById);
router.delete("/admin_delete/:id", adminAuthMiddleware, deleteUser);
router.get("/dashboard-data", protect, getuserDahboardData);


module.exports = router;
