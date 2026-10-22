const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }

  // Videos
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "Only image and video files are allowed"
    ),
    false
  );
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    files: 10,
  },
});

module.exports = upload;