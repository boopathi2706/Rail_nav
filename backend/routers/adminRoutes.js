const express = require("express");

const router = express.Router();

const {
  adminLogin,
  adminDashboard,
  } = require("../controllers/adminController");
  const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");


// ======================================================
// ADMIN LOGIN
// ======================================================

router.post("/login", adminLogin);


// ======================================================
// TEST PROTECTED ADMIN ROUTE
// ======================================================
router.get("/admin_dashboard", adminAuthMiddleware,adminDashboard);


module.exports = router;