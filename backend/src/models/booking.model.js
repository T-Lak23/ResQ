import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "pending"],
      default: "pending",
    },
    specialRequests: {
      type: String,
    },
    hasNotified: {
      type: Boolean,
      default: false,
    },
    totalPeople: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({
  tableId: 1,
  status: 1,
  startTime: 1,
});

export const Booking = mongoose.model("Booking", bookingSchema);
