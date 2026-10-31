import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["staff", "admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
