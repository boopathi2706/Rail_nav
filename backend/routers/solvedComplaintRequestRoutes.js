const express = require("express");

const router = express.Router();

const {
  requestComplaintSolved,
  acceptComplaintSolved,
  checkComplaintSolvedRequest,
} = require("../controllers/requestComplaintSolved");

// ======================================================
// MULTER
// ======================================================
const officerMiddleware = require("../middlewares/officerAuthMiddleware");
const userMiddleware = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

// ======================================================
// OFFICER REQUESTS COMPLAINT AS SOLVED
// ======================================================
//
// POST
// /api/complaints/request-solved
//
// Content-Type:
// multipart/form-data
//
// Fields:
// complaintId
// officerId
// images
// videos
//
// ======================================================

router.post(
  "/solved-requests",
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
  officerMiddleware,
  requestComplaintSolved
);

router.put(
  "/accept-solved",
  userMiddleware,
  acceptComplaintSolved
);

router.get(
  "/check-solved-request",
  officerMiddleware,
  checkComplaintSolvedRequest
);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;