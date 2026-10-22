const express = require("express");

const router = express.Router();

const {
  createStation,
  loginStation,
  getAllStations,
  getOneStation,
  updateStation,
  deleteStation,
  getdashboarddata
} = require("../controllers/stationController");



const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
const stationAuthMiddleware = require("../middlewares/stationAuthMiddleware");

// ========================================
// PUBLIC
// ========================================

router.post("/login", loginStation);


// ========================================
// PROTECTED
// ========================================

router.post(
  "/create",
  adminAuthMiddleware,
  createStation
);

router.get(
  "/all_stations",
  adminAuthMiddleware,
  getAllStations
);

router.get(
  "/stations/:id",
  adminAuthMiddleware,
  getOneStation
);

router.put(
  "/update_stations/:id",
  adminAuthMiddleware,
  updateStation
);
router.put(
  "/update/:id",
  stationAuthMiddleware,
  updateStation
);

router.delete(
  "/delete_stations/:id",
  adminAuthMiddleware,
  deleteStation
);
router.get(
  "/dashboard/:stationId",
  stationAuthMiddleware,
  getdashboarddata
);



module.exports = router;