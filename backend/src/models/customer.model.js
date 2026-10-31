import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
    lastVisit: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Customer = mongoose.model("Customer", customerSchema);
