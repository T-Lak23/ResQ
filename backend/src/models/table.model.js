import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bookingLock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });

export const Table = mongoose.model("Table", tableSchema);
