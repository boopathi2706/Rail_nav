const nodemailer = require("nodemailer");

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

// Test SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
  }
});

const sendOTPEmail = async (email, otp, purpose) => {
  try {
    const info = await transporter.sendMail({
      from: `"Rail Nav" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Rail Nav - Email Verification OTP",


html: `
<div style="
  max-width: 560px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
">

  <!-- Header -->
  <div style="
    background: linear-gradient(135deg, #0f172a, #1e3a8a);
    padding: 30px 25px;
    text-align: center;
  ">

    <div style="
      font-size: 42px;
      margin-bottom: 10px;
    ">
      🚆
    </div>

    <h1 style="
      margin: 0;
      color: #ffffff;
      font-size: 30px;
      letter-spacing: 1px;
    ">
      Rail Nav
    </h1>

    <p style="
      margin: 8px 0 0;
      color: #cbd5e1;
      font-size: 14px;
    ">
      Smart Railway Navigation
    </p>

  </div>


  <!-- Main Content -->
  <div style="
    padding: 35px 30px;
    text-align: center;
  ">

    <div style="
      display: inline-block;
      background: #e0f2fe;
      border-radius: 50%;
      width: 70px;
      height: 70px;
      line-height: 70px;
      font-size: 32px;
      margin-bottom: 15px;
    ">
      ✉️
    </div>

    <h2 style="
      margin: 5px 0 10px;
      color: #0f172a;
      font-size: 24px;
    ">
      ${purpose}
    </h2>

    <p style="
      margin: 0 auto 25px;
      color: #64748b;
      font-size: 15px;
      line-height: 1.7;
      max-width: 430px;
    ">
      Please use the verification code below to complete your
      <strong style="color: #1e3a8a;">
        ${purpose.toLowerCase()}
      </strong>
      securely.
    </p>


    <!-- OTP Card -->
    <div style="
      background: #f8fafc;
      border: 2px dashed #2563eb;
      border-radius: 16px;
      padding: 25px 20px;
      margin: 25px 0;
    ">

      <p style="
        margin: 0 0 10px;
        color: #64748b;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: bold;
      ">
        🔐 ${purpose} Verification Code
      </p>

      <h1 style="
        margin: 10px 0 18px;
        color: #1d4ed8;
        font-size: 38px;
        letter-spacing: 10px;
        font-weight: 700;
      ">
        ${otp}
      </h1>



      <p style="
        margin: 14px 0 0;
        color: #94a3b8;
        font-size: 12px;
      ">
        Copy the code and enter it in the Rail Nav application.
      </p>

    </div>


    <!-- Purpose Information -->
    <div style="
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 14px 16px;
      text-align: left;
      margin: 20px 0;
    ">

      <p style="
        margin: 0;
        color: #1e40af;
        font-size: 13px;
        line-height: 1.6;
      ">
        🎯 <strong>OTP Purpose</strong><br>
        This code is being used for:
        <strong>${purpose}</strong>
      </p>

    </div>


    <!-- Expiry Warning -->
    <div style="
      background: #fff7ed;
      border-left: 4px solid #f97316;
      border-radius: 8px;
      padding: 14px 16px;
      text-align: left;
      margin: 20px 0;
    ">

      <p style="
        margin: 0;
        color: #9a3412;
        font-size: 14px;
        line-height: 1.6;
      ">
        ⏱️ <strong>OTP expires in 10 minutes.</strong><br>
        Please complete verification before the code expires.
      </p>

    </div>


    <!-- Security Notice -->
    <div style="
      background: #f0fdf4;
      border-radius: 10px;
      padding: 15px;
      text-align: left;
      margin-top: 20px;
    ">

      <p style="
        margin: 0;
        color: #166534;
        font-size: 13px;
        line-height: 1.6;
      ">
        🛡️ <strong>Security Notice</strong><br>
        Never share this verification code with anyone.
        Rail Nav will never ask you for your OTP.
      </p>

    </div>

  </div>


  <!-- Footer -->
  <div style="
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 25px;
    text-align: center;
  ">

    <p style="
      margin: 0 0 8px;
      color: #475569;
      font-size: 14px;
    ">
      🚆 <strong>Rail Nav</strong>
    </p>

    <p style="
      margin: 0;
      color: #94a3b8;
      font-size: 12px;
      line-height: 1.6;
    ">
      Smart navigation for a better railway experience.
    </p>

    <p style="
      margin: 15px 0 0;
      color: #cbd5e1;
      font-size: 11px;
    ">
      © ${new Date().getFullYear()} Rail Nav. All rights reserved.
    </p>

  </div>

</div>
`,

    });

    console.log("✅ OTP email sent:", info.messageId);

    return true;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
};

module.exports = sendOTPEmail;