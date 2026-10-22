const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Officer = require("../models/Officer");
const PasswordReset = require("../models/PasswordReset");

// ======================================================
// EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
  }
});


// ======================================================
// GENERATE OTP
// ======================================================

const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ======================================================
// FIND ACCOUNT
// ======================================================

const findAccount = async (email, type) => {
  const normalizedEmail =
    String(email).trim().toLowerCase();

  if (type === "user") {
    return await User.findOne({
      email: normalizedEmail,
    });
  }

  if (type === "officer") {
    return await Officer.findOne({
      email: normalizedEmail,
    });
  }

  // Admin is handled separately because your
  // admin login currently uses fixed credentials.
  if (type === "admin") {
    if (
      normalizedEmail ===
      String(process.env.ADMIN_EMAIL)
        .trim()
        .toLowerCase()
    ) {
      return {
        email: process.env.ADMIN_EMAIL,
        isAdmin: true,
      };
    }

    return null;
  }

  return null;
};

// ======================================================
// SEND OTP EMAIL
// ======================================================

const sendPasswordResetEmail = async (
  email,
  otp,
  type
) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f4f7fb;
      font-family: Arial, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
    }

    .header {
      background: #0f172a;
      color: white;
      padding: 30px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
    }

    .content {
      padding: 35px;
      text-align: center;
    }

    .otp {
      display: inline-block;
      margin: 25px 0;
      padding: 15px 30px;
      background: #f1f5f9;
      border-radius: 12px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #0f172a;
    }

    .warning {
      color: #64748b;
      font-size: 14px;
      line-height: 1.6;
    }

    .footer {
      padding: 20px;
      text-align: center;
      background: #f8fafc;
      color: #94a3b8;
      font-size: 12px;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      <h1>Rail Nav</h1>
      <p>Password Reset</p>
    </div>

    <div class="content">

      <h2>Reset Your Password</h2>

      <p>
        We received a request to reset your
        ${type} account password.
      </p>

      <p>Your verification OTP is:</p>

      <div class="otp">
        ${otp}
      </div>

      <p class="warning">
        This OTP is valid for 10 minutes.
        Do not share this OTP with anyone.
      </p>

    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Rail Nav
    </div>

  </div>

</body>
</html>
`;

  await transporter.sendMail({
    from: `"Rail Nav" <${process.env.EMAIL_USER}>`,

    to: email,

    subject:
      "Rail Nav - Password Reset OTP",

    html,
  });
};

// ======================================================
// FORGOT PASSWORD
// POST /api/password/forgot
// ======================================================

const forgotPassword = async (req, res) => {
  try {
    const {
      email,
      type,
    } = req.body || {};

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!email || !type) {
      return res.status(400).json({
        success: false,
        message:
          "Email and account type are required",
      });
    }

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    const normalizedType =
      String(type)
        .trim()
        .toLowerCase();

    if (
      ![
        "user",
        "officer",
        "admin",
      ].includes(normalizedType)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Type must be user, officer or admin",
      });
    }

    // ==================================================
    // FIND ACCOUNT
    // ==================================================

    const account =
      await findAccount(
        normalizedEmail,
        normalizedType
      );

    if (!account) {
      return res.status(404).json({
        success: false,
        message:
          "No account found with this email and account type",
      });
    }

    // ==================================================
    // REMOVE OLD OTP
    // ==================================================

    await PasswordReset.deleteMany({
      email: normalizedEmail,
      type: normalizedType,
    });

    // ==================================================
    // GENERATE OTP
    // ==================================================

    const otp =
      generateOTP();

    const expiresAt =
      new Date(
        Date.now() +
          10 * 60 * 1000
      );

    // ==================================================
    // SAVE OTP
    // ==================================================

    await PasswordReset.create({
      email: normalizedEmail,

      type: normalizedType,

      otp,

      expiresAt,

      verified: false,
    });

    // ==================================================
    // SEND EMAIL
    // ==================================================

    try {
      await sendPasswordResetEmail(
        normalizedEmail,
        otp,
        normalizedType
      );
    } catch (emailError) {
      console.error(
        "Password reset email error:",
        emailError
      );

      await PasswordReset.deleteMany({
        email: normalizedEmail,
        type: normalizedType,
      });

      return res.status(500).json({
        success: false,
        message:
          "Failed to send OTP email",
      });
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "OTP sent successfully to your email",

      data: {
        email: normalizedEmail,
        type: normalizedType,
        expiresIn: "10 minutes",
      },
    });

  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to process forgot password request",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// VERIFY OTP + CHANGE PASSWORD
//
// POST /api/password/reset
// ======================================================

const verifyOTPAndResetPassword =
  async (req, res) => {
    try {
      const {
        email,
        type,
        otp,
        newPassword,
      } = req.body || {};

      console.log(
        "Password reset request:",
        {
          email,
          type,
          otp,
        }
      );

      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        !email ||
        !type ||
        !otp ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Email, type, OTP and new password are required",
        });
      }

      if (
        String(newPassword).length <
        6
      ) {
        return res.status(400).json({
          success: false,

          message:
            "New password must contain at least 6 characters",
        });
      }

      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      const normalizedType =
        String(type)
          .trim()
          .toLowerCase();

      // ==================================================
      // FIND OTP
      // ==================================================

      const resetRequest =
        await PasswordReset.findOne({
          email: normalizedEmail,

          type: normalizedType,

          otp: String(otp).trim(),
        });

      if (!resetRequest) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid OTP",
        });
      }

      // ==================================================
      // CHECK OTP EXPIRATION
      // ==================================================

      if (
        resetRequest.expiresAt <
        new Date()
      ) {
        await PasswordReset.deleteOne({
          _id: resetRequest._id,
        });

        return res.status(400).json({
          success: false,

          message:
            "OTP has expired. Please request a new OTP",
        });
      }

      // ==================================================
      // FIND ACCOUNT
      // ==================================================

      const account =
        await findAccount(
          normalizedEmail,
          normalizedType
        );

      if (!account) {
        return res.status(404).json({
          success: false,

          message:
            "Account not found",
        });
      }

      // ==================================================
      // HASH NEW PASSWORD
      // ==================================================

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      // ==================================================
      // UPDATE PASSWORD
      // ==================================================

      if (
        normalizedType ===
        "user"
      ) {
        account.password =
          hashedPassword;

        await account.save();
      }

      else if (
        normalizedType ===
        "officer"
      ) {
        account.password =
          hashedPassword;

        await account.save();
      }

      else if (
        normalizedType ===
        "admin"
      ) {
        /*
         * Your current admin login uses:
         *
         * username: admin
         * password: admin@123
         *
         * If admin credentials are currently
         * hard-coded in adminController.js,
         * they cannot be changed by saving
         * a MongoDB document.
         *
         * We handle admin password through
         * environment variables below.
         */

        return res.status(400).json({
          success: false,

          message:
            "Admin password is currently configured as a fixed credential. Move admin credentials to a database or environment-based credential store to enable password reset.",
        });
      }

      // ==================================================
      // DELETE USED OTP
      // ==================================================

      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        message:
          "Password changed successfully",

        data: {
          email:
            normalizedEmail,

          type:
            normalizedType,
        },
      });

    } catch (error) {
      console.error(
        "Verify OTP And Reset Password Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to reset password",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  forgotPassword,
  verifyOTPAndResetPassword,
};