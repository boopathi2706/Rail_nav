const jwt = require("jsonwebtoken");

const stationAuthMiddleware = async (req, res, next) => {
  try {
    let token;

    // ========================================
    // Get token from Authorization header
    // ========================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ========================================
    // Token not found
    // ========================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Station login required.",
      });
    }

    // ========================================
    // Verify JWT
    // ========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ========================================
    // Make sure token belongs to a station
    // ========================================

    if (
      !decoded.stationId ||
      decoded.role !== "station"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid station token",
      });
    }

    // ========================================
    // Attach station information to request
    // ========================================

    req.station = {
      stationId: decoded.stationId,
      stationCode: decoded.stationCode,
      role: decoded.role,
    };

    // ========================================
    // Continue to controller
    // ========================================

    next();

  } catch (error) {
    console.error(
      "Station JWT Error:",
      error.message
    );

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Station token has expired. Please login again.",
      });
    }

    // Invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid station token",
      });
    }

    // Other errors
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = stationAuthMiddleware;