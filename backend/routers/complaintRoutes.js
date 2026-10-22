const express = require("express");

const router = express.Router();

const {
  createComplaint,
  moveNextStation,
  changePendingToOngoing,
  getComplaintsByStationId,
  getComplaintById,
  getComplaintsByOfficerId,
  getComplaintsByUserId,
  deleteComplaint,
  getAllComplaints,

} = require("../controllers/complaintController");

const userAuthMiddleware = require(
  "../middlewares/authMiddleware"
);
const officerAuthMiddleware = require(
  "../middlewares/officerAuthMiddleware"
);
const stationAuthMiddleware = require(
  "../middlewares/stationAuthMiddleware"
);
const adminAuthMiddleware = require(
  "../middlewares/adminAuthMiddleware"
);

const upload = require(
  "../middlewares/uploadMiddleware"
);


// ======================================================
// CREATE COMPLAINT
// ======================================================

router.post(
  "/create",

  userAuthMiddleware,

  upload.fields([
    {
      name: "images",
      maxCount: 5,
    },
    {
      name: "videos",
      maxCount: 3,
    },
  ]),

  createComplaint
);

router.put(
  "/move-next-station",
  stationAuthMiddleware,
  moveNextStation
);
router.put(
  "/officer/move-next-station",
  officerAuthMiddleware,
  moveNextStation
);
router.put(
  "/station/move-next-station",
  stationAuthMiddleware,
  moveNextStation
)
router.put(
  "/:complaintId/ongoing",
  officerAuthMiddleware,
  changePendingToOngoing
);

// get complaint by id

router.get(
  "/officer/:complaintId",
  officerAuthMiddleware,
  getComplaintById
);
router.get(
  "/station/:complaintId",
  stationAuthMiddleware,
  getComplaintById
);
router.get(
  "/admin/:complaintId",
  adminAuthMiddleware,
  getComplaintById
);
router.get(
  "/user/:complaintId",
  userAuthMiddleware,
  getComplaintById
);
// get all complaints by station id, officer id, and user id

router.get(
  "/get_all/:stationId",
  getComplaintsByStationId
);
router.get(
  "/get_all/:officerId",
  officerAuthMiddleware,
  getComplaintsByOfficerId
);

router.get(
  "/my-complaints",
  userAuthMiddleware,
  getComplaintsByUserId
);
router.get(
  "/admin_get_all_complaints",
  adminAuthMiddleware,
  getAllComplaints
);

// delete complaint by admin & user

router.delete(
  "/user/delete/:complaintId",
  userAuthMiddleware,
  deleteComplaint
);


router.delete(
  "/admin/delete/:complaintId",
  adminAuthMiddleware,
  deleteComplaint
);


module.exports = router;