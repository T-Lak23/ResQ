import { Router } from "express";
import {
  createBooking,
  getBookings,
  getOneBooking,
  updateBooking,
  deleteBooking,
  publicGetBooking,
  getAllCustomers,
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

export const bookingRouter = Router();

bookingRouter.get("/", verifyToken, getBookings);
// bookingRouter.get("/:restaurantId/:email", verifyToken, getBookings);
bookingRouter.get("/:restaurantId/:bookingId", getOneBooking);
bookingRouter.get("/public/:restaurantId/:bookingId", publicGetBooking);
bookingRouter.post("/", createBooking);
bookingRouter.patch("/:bookingId", verifyToken, updateBooking);
bookingRouter.delete("/:bookingId", verifyToken, isAdmin, deleteBooking);
bookingRouter.get("/customers", verifyToken, getAllCustomers);

export default bookingRouter;
