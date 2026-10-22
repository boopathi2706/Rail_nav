const jwt = require("jsonwebtoken");

const officerAuthMiddleware = async (
  req,
  res,
  next
) => {
  try {
    let token;

    // ========================================
    // Get token
    // ========================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization.split(" ")[1];
    }

    // ========================================
    // Token missing
    // ========================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. Officer login required.",
      });
    }

    // ========================================
    // Verify token
    // ========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ========================================
    // Verify officer role
    // ========================================

    if (
      !decoded.officerId ||
      decoded.role !== "officer"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid officer token",
      });
    }

    // ========================================
    // Attach officer data
    // ========================================

    req.officer = {
      officerId: decoded.officerId,
      email: decoded.email,
      officerType: decoded.officerType,
      stationId: decoded.stationId,
      role: decoded.role,
    };

    next();

  } catch (error) {
    console.error(
      "Officer JWT Error:",
      error.message
    );

    if (
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Officer token expired. Please login again.",
      });
    }

    if (
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid officer token",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Officer authentication failed",
    });
  }
};

module.exports = officerAuthMiddleware;