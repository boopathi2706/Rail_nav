const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const PasswordResetOTP = require("../models/PasswordResetOTP");


// ======================================================
// NODEMAILER TRANSPORTER
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


// ======================================================
// GENERATE 6 DIGIT OTP
// ======================================================

const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ======================================================
// SEND FORGOT PASSWORD EMAIL
// ======================================================

const sendForgotPasswordEmail = async (
  email,
  otp
) => {
  const mailOptions = {
    from: `"Rail Nav" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Rail Nav - Password Reset OTP",

    html: `
      <!DOCTYPE html>

      <html>
      <head>
        <meta charset="UTF-8">

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
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          }

          .header {
            background: #0f172a;
            color: white;
            padding: 25px;
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
            background: #f1f5f9;
            padding: 15px 30px;
            margin: 20px 0;
            border-radius: 10px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #2563eb;
          }

          .copy-button {
            padding: 12px 25px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
          }

          .warning {
            color: #64748b;
            font-size: 14px;
            margin-top: 20px;
          }

          .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #64748b;
            font-size: 13px;
          }
        </style>
      </head>

      <body>

        <div class="container">

          <div class="header">
            <h1>🚆 Rail Nav</h1>
          </div>

          <div class="content">

            <h2>Password Reset Request</h2>

            <p>
              We received a request to reset your Rail Nav
              account password.
            </p>

            <p>
              Your One-Time Password is:
            </p>

            <div class="otp">
              ${otp}
            </div>

            <br>

            <button
              onclick="navigator.clipboard.writeText('${otp}')"
              class="copy-button"
            >
              Copy OTP
            </button>

            <p class="warning">
              This OTP is valid for 10 minutes.
            </p>

            <p class="warning">
              If you did not request this password reset,
              please ignore this email.
            </p>

          </div>

          <div class="footer">
            © ${new Date().getFullYear()} Rail Nav
          </div>

        </div>

      </body>
      </html>
    `,
  };

  return await transporter.sendMail(
    mailOptions
  );
};

// ======================================================
// USER FORGOT PASSWORD
// POST /api/users/forgot-password
// ======================================================

const userForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // ==================================================
    // FIND USER
    // ==================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No user account found with this email",
      });
    }

    // ==================================================
    // GENERATE OTP
    // ==================================================

    const otp = generateOTP();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // ==================================================
    // REMOVE OLD OTP
    // ==================================================

    await PasswordResetOTP.deleteMany({
      email: normalizedEmail,
      userType: "user",
    });

    // ==================================================
    // STORE OTP
    // ==================================================

    await PasswordResetOTP.create({
      email: normalizedEmail,
      userType: "user",
      otp,
      expiresAt,
    });

    // ==================================================
    // SEND EMAIL
    // ==================================================

    try {
      await sendForgotPasswordEmail(
        normalizedEmail,
        otp
      );
      console.log(`OTP sent to ${normalizedEmail}: ${otp}`);
    } catch (emailError) {
      console.error(
        "Forgot Password Email Error:",
        emailError
      );

      await PasswordResetOTP.deleteMany({
        email: normalizedEmail,
        userType: "user",
      });

      return res.status(500).json({
        success: false,
        message:
          "Failed to send OTP email. Please try again.",
      });
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message:
        "OTP sent successfully to your registered email",
      email: normalizedEmail,
      expiresIn: "10 minutes",
    });

  } catch (error) {
    console.error(
      "User Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to process forgot password request",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ======================================================
// VERIFY OTP + CHANGE USER PASSWORD
// POST /api/users/verify-forgot-password
// ======================================================



// ======================================================
// VERIFY OTP + CHANGE USER PASSWORD
// ======================================================

// ======================================================
// VERIFY USER FORGOT PASSWORD
// OTP + NEW PASSWORD
// ======================================================

const verifyUserForgotPassword = async (req, res) => {
  try {
    console.log("========== VERIFY FORGOT PASSWORD ==========");

    console.log("Request body:", req.body);

    const {
      email,
      otp,
      newPassword,
    } = req.body || {};

    // ==================================================
    // 1. VALIDATION
    // ==================================================

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email, OTP and new password are required",
      });
    }

    const normalizedEmail =
      String(email).trim().toLowerCase();

    const normalizedOTP =
      String(otp).trim();

    // ==================================================
    // 2. FIND PASSWORD RESET REQUEST
    // ==================================================

    const passwordRequest =
      await PasswordResetOTP.findOne({
        email: normalizedEmail,

        // IMPORTANT:
        // Schema field is userType, NOT type
        userType: "user",
      });

    if (!passwordRequest) {
      console.error(
        "Password reset request not found:",
        normalizedEmail
      );

      return res.status(404).json({
        success: false,
        message:
          "Password reset request not found or expired",
      });
    }

    console.log(
      "Password reset request found:",
      passwordRequest._id
    );

    // ==================================================
    // 3. CHECK OTP
    // ==================================================

    if (
      String(passwordRequest.otp).trim() !==
      normalizedOTP
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ==================================================
    // 4. CHECK OTP EXPIRY
    // ==================================================

    if (
      passwordRequest.expiresAt &&
      new Date() >
        new Date(passwordRequest.expiresAt)
    ) {
      // IMPORTANT:
      // Use PasswordResetOTP, not PasswordRequest
      await PasswordResetOTP.deleteOne({
        _id: passwordRequest._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP",
      });
    }

    // ==================================================
    // 5. PASSWORD VALIDATION
    // ==================================================

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // ==================================================
    // 6. FIND USER
    // ==================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      console.error(
        "User not found:",
        normalizedEmail
      );

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==================================================
    // 7. HASH NEW PASSWORD
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(
        String(newPassword),
        10
      );

    // ==================================================
    // 8. UPDATE USER PASSWORD
    // ==================================================

    user.password = hashedPassword;

    user.lastUpdateAt = new Date();

    await user.save();

    console.log(
      "User password updated successfully"
    );

    // ==================================================
    // 9. DELETE USED OTP REQUEST
    // ==================================================

    await PasswordResetOTP.deleteOne({
      _id: passwordRequest._id,
    });

    console.log(
      "Password reset OTP request deleted"
    );

    // ==================================================
    // 10. SUCCESS
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "OTP verified and password changed successfully",
    });

  } catch (error) {
    console.error(
      "Verify User Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to change password",

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
  userForgotPassword,
  verifyUserForgotPassword,
};