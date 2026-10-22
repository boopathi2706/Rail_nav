const mongoose = require("mongoose");

const solvedComplaintRequestSchema =
  new mongoose.Schema(
    {
      // ==============================================
      // USER
      // ==============================================

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // ==============================================
      // COMPLAINT
      // ==============================================

      complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
        required: true,
      },

      // ==============================================
      // OFFICER
      // ==============================================

      officerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Officer",
        required: true,
      },

      // ==============================================
      // SOLVED EVIDENCE
      // ==============================================

      solvedProof: {
        images: {
          type: [String],
          default: [],
        },

        videos: {
          type: [String],
          default: [],
        },
      },

      // ==============================================
      // REQUEST STATUS
      // ==============================================

      status: {
        type: String,

        enum: [
          "pending",
          "accepted",
          "rejected",
        ],

        default: "pending",
      },

      // ==============================================
      // USER RESPONSE DATE
      // ==============================================

      respondedAt: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );


// ======================================================
// EXPORT MODEL
// ======================================================

module.exports = mongoose.model(
  "SolvedComplaintRequest",
  solvedComplaintRequestSchema
);