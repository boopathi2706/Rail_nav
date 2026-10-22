const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER DETAILS
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // ==========================================
    // JOURNEY DETAILS
    // ==========================================

    pnrNumber: {
      type: String,
      required: true,
      trim: true,
    },

    trainNumber: {
      type: String,
      required: true,
      trim: true,
    },

    incidentDateTime: {
      type: Date,
      required: true,
    },

    // ==========================================
    // COMPLAINT CATEGORY
    // ==========================================

    complaintCategory: {
      type: String,
      required: true,
      enum: [
        "catering",
        "cleanliness",
        "electrical",
        "security",
        "water",
        "medical",
        "staff",
        "ticketing",
        "coach",
        "platform",
        "other",
      ],
    },

    // ==========================================
    // EVIDENCE PROOF
    // ==========================================

    evidenceProof: {
      images: {
        type: [String],
        default: [],
      },

      videos: {
        type: [String],
        default: [],
      },
    },

    // ==========================================
    // NEXT STATION
    // ==========================================

    nextStationName: {
      type: String,
      trim: true,
    },

    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      default: null,
    },

    // ==========================================
    // ASSIGNED OFFICER
    // ==========================================

    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Officer",
      default: null,
    },

    // ==========================================
    // NEXT ROUTES
    // ==========================================

    nextRoutes: [
      {
        stationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Station",
        },

        stationName: {
          type: String,
          trim: true,
        },
      },
    ],

    // ==========================================
    // COMPLAINT DESCRIPTION / HISTORY
    // ==========================================

    descriptions: [
      {
        id: {
          type: String,
        },

        who: {
          type: String,
          enum: [
            "user",
            "officer",
            "station",
          ],
        },

        message: {
          type: String,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ==========================================
    // COMPLAINT STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "pending",
        "ongoing",
        "solved",
      ],
      default: "pending",
    },

    // ==========================================
    // SOLVED PROOF
    // ==========================================

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

    // ==========================================
    // SOLVED DATE & TIME
    // ==========================================

    solvedDateTime: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);