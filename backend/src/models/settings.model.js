import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      unique: true,
    },
    openingTime: {
      type: String,
      default: "09:00",
    },
    closingTime: {
      type: String,
      default: "22:00",
    },

    slotDuration: {
      type: Number,
      default: 60,
    },
    blockedDates: {
      type: [Date],
      default: [],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Settings = mongoose.model("Settings", settingsSchema);
