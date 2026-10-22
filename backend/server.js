const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// files import
const connectDB = require("./config/databaseConfig");
const userRoutes = require("./routers/userRoutes");
const complaintRoutes = require("./routers/complaintRoutes");
const solvedComplaintRequestRoutes = require("./routers/solvedComplaintRequestRoutes");
const ticketRoutes = require("./routers/ticketRoutes");

// MongoDB Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/users/forgot", userRoutes);
app.use("/api/admin", require("./routers/adminRoutes"));
app.use("/api/officers", require("./routers/officerRoutes"));
app.use("/api/stations", require("./routers/stationRoutes"));
app.use("/api/complaints", complaintRoutes);
app.use("/api/request", solvedComplaintRequestRoutes);
app.use("/api/tickets", ticketRoutes);

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASSWORD:",
  process.env.EMAIL_PASSWORD ? "Loaded" : "Missing",
);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
