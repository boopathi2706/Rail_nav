const express = require("express");
const multer = require("multer");

const {
  analyzeTicket,
} = require("../controllers/ticketController");

const userAuthMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/tickets/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}-${file.originalname}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG and PNG files are allowed."
        )
      );
    }
  },
});

router.post(
  "/analyze",
  userAuthMiddleware,
  upload.single("ticket"),
  analyzeTicket
);

module.exports = router;