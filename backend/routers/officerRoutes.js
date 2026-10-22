const express = require("express");

const router = express.Router();

const {
  createOfficer,
  loginOfficer,
  getOfficerProfile,
  getOfficerStation,
  updateOfficer,
  updateOfficerbyAdmin,
  deleteOfficer,
  changeOfficerPassword,
  getComplaintsByOfficerId,
  officerDashboarddata,
  getAllOfficers,
} = require("../controllers/officerController");

const officerAuthMiddleware = require("../middlewares/officerAuthMiddleware");
const stationAuthMiddleware = require("../middlewares/stationAuthMiddleware");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");


// ======================================================
// PUBLIC
// ======================================================

// Officer login
router.post(
  "/login",
  loginOfficer
);


router.post(
  "/create_officers",
  stationAuthMiddleware,
  createOfficer
);

router.get(
  "/all",
  adminAuthMiddleware,
  getAllOfficers
);

router.delete(
  "/delete_officers/:id",
  stationAuthMiddleware,
  deleteOfficer
);
router.delete(
  "/admin_delete_officers/:id",
  adminAuthMiddleware,
  deleteOfficer
);

// ======================================================
// PROTECTED
// ======================================================


// Get officer profile
router.get(
  "/profile",
  officerAuthMiddleware,
  getOfficerProfile
);

// Get officer station
router.get(
  "/station",
  officerAuthMiddleware,
  getOfficerStation
);

// Update officer
router.put(
  "/update",
  officerAuthMiddleware,
  updateOfficer
);

router.put(
  "/update/:id",
  stationAuthMiddleware,
  updateOfficer
);

router.put(
  "/admin_update/:id",
  adminAuthMiddleware,
  updateOfficerbyAdmin
);

// Change password
router.put(
  "/change-password",
  officerAuthMiddleware,
  changeOfficerPassword
);

router.get(
  "/complaints",
  officerAuthMiddleware,
  getComplaintsByOfficerId
);

router.get(
  "/dashboard",
  officerAuthMiddleware,
  officerDashboarddata
);

module.exports = router;