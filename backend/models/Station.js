const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true,
      trim: true,
    },

    stationCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    stationCategory: {
      type: String,
      required: true,
      enum: [
        "NSG-1",
        "NSG-2",
        "NSG-3",
        "NSG-4",
        "NSG-5",
        "NSG-6",
        "HG-1",
        "HG-2",
        "HG-3",
      ],
    },
    stationPassword:{
        type: String,
        required: true,
    },

    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },
    },

    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    elevation: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "lastUpdatedAt",
    },
  }
);

module.exports = mongoose.model("Station", stationSchema);