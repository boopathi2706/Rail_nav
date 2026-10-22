const jwt = require("jsonwebtoken");

// ======================================================
// ADMIN JWT VERIFICATION
// ======================================================

const adminAuthMiddleware = async (req, res, next) => {
  try {
    let token;

    // ------------------------------------------
    // Get token from Authorization header
    // ------------------------------------------

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ------------------------------------------
    // Token not found
    // ------------------------------------------

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Admin login required.",
      });
    }

    // ------------------------------------------
    // Verify JWT
    // ------------------------------------------

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ------------------------------------------
    // Check admin role
    // ------------------------------------------

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    // ------------------------------------------
    // Attach admin information
    // ------------------------------------------

    req.admin = {
      username: decoded.username,
      role: decoded.role,
    };

    next();

  } catch (error) {
    console.error(
      "Admin JWT Error:",
      error.message
    );

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin token has expired. Please login again.",
      });
    }

    // Invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Admin authentication failed.",
    });
  }
};

module.exports = adminAuthMiddleware;