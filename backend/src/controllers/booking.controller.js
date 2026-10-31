import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Restaurant } from "../models/restaurant.model.js";
import { Table } from "../models/table.model.js";
import { Settings } from "../models/settings.model.js";
import { Customer } from "../models/customer.model.js";
import { calculateTime } from "../utils/calculateTime.js";
import { randomUUID } from "crypto";
import { env } from "../config/env.js";
import { sendBookingEmail } from "../utils/sendBookingEmail.js";

export const createBooking = async (req, res) => {
  let session;
  let lockAcquired = false;
  let table;
  try {
    const {
      name,
      email,
      phone,

      startTime,
      endTime,
      // customerId,
      tableId,
      specialRequests,
      restaurantId,
      totalPeople,
    } = req.body;
    // Transaction

    if (
      !startTime ||
      !endTime ||
      isNaN(new Date(startTime).getTime()) ||
      isNaN(new Date(endTime).getTime())
    ) {
      if (session?.inTransaction()) await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Valid startTime and endTime are required" });
    }

    table = await Table.findOneAndUpdate(
      {
        _id: tableId,
        bookingLock: false,
      },
      {
        $set: { bookingLock: true },
      },
      {
        returnDocument: "after",
      },
    );

    if (!table) {
      return res.status(409).json({
        message: "Another booking is in progress",
      });
    }
    lockAcquired = true;
    session = await mongoose.startSession();
    session.startTransaction();

    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const settings = await Settings.findOne({ restaurantId: restaurant._id });
    if (!settings) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Settings not found" });
    }

    if (!settings.isOpen) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Restaurant is closed" });
    }

    const today = new Date();

    if (new Date(startTime) < today) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Start time must be in the future" });
    }

    if (new Date(endTime) < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "End time must be in the future",
      });
    }

    const start = new Date(startTime);

    const istStartTime = new Date(
      start.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    );

    const startMinutes =
      istStartTime.getHours() * 60 + istStartTime.getMinutes();

    const [openHour, openMinute] = settings.openingTime.split(":").map(Number);

    const openingMinutes = openHour * 60 + openMinute;

    if (startMinutes < openingMinutes) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Start time must be after opening time" });
    }

    const end = new Date(endTime);

    const istTime = new Date(
      end.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      }),
    );

    const endMinutes = istTime.getHours() * 60 + istTime.getMinutes();

    const [closeHour, closeMinute] = settings.closingTime
      .split(":")
      .map(Number);

    const closingMinutes = closeHour * 60 + closeMinute;

    if (endMinutes > closingMinutes) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "End time must be before closing time",
      });
    }
    if (new Date(endTime) <= new Date(startTime)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const oneDayLater = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (new Date(startTime) > oneDayLater) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Reservation cannot be made for more than 1 day in advance",
      });
    }

    const existingBooking = await Booking.findOne({
      restaurantId: restaurant._id,
      tableId: table._id,
      status: { $in: ["confirmed", "pending"] },
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) },
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Table is not available for the selected time",
      });
    }
    let customer;
    customer = await Customer.findOne({
      email,
      phone,
      restaurantId: restaurant._id,
    }).session(session);
    if (customer) {
      customer.totalVisits++;
      await customer.save({ session });
    }

    let customerId;
    if (!customer) {
      const [newCustomer] = await Customer.create(
        [
          {
            restaurantId: restaurant._id,
            name,
            email,
            phone,
          },
        ],
        { session },
      );
      customerId = newCustomer._id;
      customer = newCustomer;
    } else {
      customerId = customer._id;
    }

    const bookingId = `BK-${randomUUID()}`;
    const [booking] = await Booking.create(
      [
        {
          bookingId,
          restaurantId: restaurant._id,
          tableId: table._id,
          customerId,
          specialRequests,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: "pending",
          totalPeople: totalPeople || 1,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    await sendBookingEmail(
      customer.email,
      customer.name,
      restaurant.name,
      table.tableNumber,
      "pending",
      {
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalPeople,
        specialRequests,
      },
    );

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.log("Booking creation failed:", error);
    }
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    res.status(500).json({ message: "Booking creation failed" });
  } finally {
    if (session) {
      await session.endSession();
    }
    if (lockAcquired && table) {
      await Table.updateOne(
        { _id: table._id },
        { $set: { bookingLock: false } },
      );
    }
  }
};

export const getBookings = async (req, res) => {
  try {
    const { email, phone } = req.query;

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const query = { restaurantId: restaurant._id };

    if (email || phone) {
      const customerQuery = { restaurantId: restaurant._id };
      if (email) customerQuery.email = email;
      if (phone) customerQuery.phone = phone;

      const customer = await Customer.findOne(customerQuery);

      if (!customer) {
        return res.status(200).json({ bookings: [] });
      }

      query.customerId = customer._id;
    }

    const bookings = await Booking.find(query)
      .populate("tableId")
      .populate("customerId")
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.log("Get bookings failed:", error);
    }
    res.status(500).json({ message: "Get bookings failed" });
  }
};

export const getOneBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.log("Get booking failed:", error);
    }
    res.status(500).json({ message: "Get booking failed" });
  }
};

export const publicGetBooking = async (req, res) => {
  try {
    const { restaurantId, bookingId } = req.params;
    const { email, phone } = req.query;

    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const query = { restaurantId: restaurant._id };

    if (email || phone) {
      const customerQuery = { restaurantId: restaurant._id };
      if (email) customerQuery.email = email;
      if (phone) customerQuery.phone = phone;

      const customer = await Customer.findOne(customerQuery);

      if (!customer) {
        return res.status(200).json({ bookings: [] });
      }

      query.customerId = customer._id;
    }

    const booking = await Booking.findOne({ bookingId: bookingId, ...query })
      .populate("tableId")
      .populate("customerId")
      .sort({ createdAt: -1 });

    res.status(200).json({ booking });
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.log("Get bookings failed:", error);
    }
    res.status(500).json({ message: "Get bookings failed" });
  }
};

// export const updateBooking = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     if (!bookingId) {
//       return res.status(400).json({ message: "Invalid booking ID" });
//     }

//     const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }
//     const table = await Table.findOne({ _id: req.body.tableId });
//     if (!table) {
//       return res.status(404).json({ message: "Table not found" });
//     }

//     const { status, startTime, endTime } = req.body;
//     if (startTime || endTime) {
//       const settings = await Settings.findOne({ restaurantId: restaurant._id });
//       const today = new Date();

//       if (new Date(startTime) < today) {
//         return res
//           .status(400)
//           .json({ message: "Start time must be in the future" });
//       }

//       if (new Date(endTime) < new Date()) {
//         return res.status(400).json({
//           message: "End time must be in the future",
//         });
//       }

//       const start = new Date(startTime);

//       const startMinutes = start.getHours() * 60 + start.getMinutes();

//       const [openHour, openMinute] = settings.openingTime
//         .split(":")
//         .map(Number);

//       const openingMinutes = openHour * 60 + openMinute;

//       if (startMinutes < openingMinutes) {
//         return res
//           .status(400)
//           .json({ message: "Start time must be after opening time" });
//       }

//       const end = new Date(endTime);

//       const endMinutes = end.getHours() * 60 + end.getMinutes();

//       const [closeHour, closeMinute] = settings.closingTime
//         .split(":")
//         .map(Number);

//       const closingMinutes = closeHour * 60 + closeMinute;

//       if (endMinutes > closingMinutes) {
//         return res
//           .status(400)
//           .json({ message: "End time must be before closing time" });
//       }

//       if (new Date(endTime) <= new Date(startTime)) {
//         return res
//           .status(400)
//           .json({ message: "End time must be after start time" });
//       }

//       const date = new Date();
//       const month = date.getMonth() + 1;
//       const day = date.getDate();

//       const minimumTime = new Date(
//         Date.now() + settings.slotDuration * 60 * 1000,
//       );
//       if (new Date(startTime) < minimumTime) {
//         return res.status(400).json({
//           message: `Start time must be at least ${calculateTime(
//             settings.slotDuration,
//           )} from now`,
//         });
//       }

//       const oneDayLater = new Date(Date.now() + 24 * 60 * 60 * 1000);

//       if (new Date(startTime) > oneDayLater) {
//         return res.status(400).json({
//           message: "Reservation cannot be made for more than 1 day in advance",
//         });
//       }
//     }
//     const existingBooking = await Booking.findOne({
//       restaurantId: restaurant._id,
//       tableId: table._id,
//       status: "confirmed",
//       startTime: { $lt: new Date(endTime) },
//       endTime: { $gt: new Date(startTime) },
//     });
//     if (existingBooking) {
//       return res.status(400).json({
//         message: "Table is not available for the selected time",
//       });
//     }

//     const booking = await Booking.findOneAndUpdate(
//       {
//         bookingId,
//         restaurantId: restaurant._id,
//       },
//       { $set: { status, startTime, endTime } },
//       { new: true },
//     ).populate("customerId");
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     resendConfirmationEmail(booking);
//     res.status(200).json({ booking });
//   } catch (error) {
//     if (env.NODE_ENV === "development") {
//       console.log("Update booking failed:", error);
//     }
//     res.status(500).json({ message: "Update booking failed" });
//   }
// };

export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const restaurant = await Restaurant.findOne({
      ownerId: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const booking = await Booking.findOne({
      bookingId,
      restaurantId: restaurant._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const { status, startTime, endTime, tableId } = req.body;

    const targetTableId = tableId || booking.tableId;

    const table = await Table.findById(targetTableId);

    if (!table) {
      return res.status(404).json({
        message: "Table not found",
      });
    }

    const newStartTime = startTime || booking.startTime;
    const newEndTime = endTime || booking.endTime;

    const isTimeChanging = Boolean(startTime || endTime);
    const isTableChanging = Boolean(
      tableId && tableId.toString() !== booking.tableId.toString(),
    );
    const isBeingConfirmed =
      status === "confirmed" && booking.status !== "confirmed";

    const isActiveBooking = ["confirmed", "pending"].includes(
      status ?? booking.status,
    );

    if (
      isActiveBooking &&
      (isTimeChanging || isTableChanging || isBeingConfirmed)
    ) {
      const settings = await Settings.findOne({
        restaurantId: restaurant._id,
      });

      if (!settings) {
        return res.status(404).json({
          message: "Settings not found",
        });
      }

      if (new Date(newStartTime) < new Date()) {
        return res.status(400).json({
          message: "Start time must be in the future",
        });
      }

      if (new Date(newEndTime) <= new Date(newStartTime)) {
        return res.status(400).json({
          message: "End time must be after start time",
        });
      }

      const start = new Date(newStartTime);
      const end = new Date(newEndTime);

      const istStart = new Date(
        start.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
      );
      const istEnd = new Date(
        end.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
      );

      const startMinutes = istStart.getHours() * 60 + istStart.getMinutes();

      const endMinutes = istEnd.getHours() * 60 + istEnd.getMinutes();

      const [openHour, openMinute] = settings.openingTime
        .split(":")
        .map(Number);

      const [closeHour, closeMinute] = settings.closingTime
        .split(":")
        .map(Number);

      const openingMinutes = openHour * 60 + openMinute;

      const closingMinutes = closeHour * 60 + closeMinute;

      if (startMinutes < openingMinutes) {
        return res.status(400).json({
          message: "Start time must be after opening time",
        });
      }

      if (endMinutes > closingMinutes) {
        return res.status(400).json({
          message: "End time must be before closing time",
        });
      }

      const conflictingBooking = await Booking.findOne({
        _id: { $ne: booking._id },
        restaurantId: restaurant._id,
        tableId: targetTableId,
        status: { $in: ["confirmed", "pending"] },
        startTime: {
          $lt: istEnd,
        },
        endTime: {
          $gt: istStart,
        },
      });

      if (conflictingBooking) {
        return res.status(400).json({
          message: "Table is not available for the selected time",
        });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      {
        $set: {
          status: status ?? booking.status,
          startTime: newStartTime,
          endTime: newEndTime,
          tableId: targetTableId,
        },
      },
      {
        returnDocument: "after",
      },
    )
      .populate("customerId")
      .populate("tableId")
      .populate("restaurantId");

    if (!booking.hasNotified && updatedBooking.status === "confirmed") {
      await sendBookingEmail(
        updatedBooking.customerId.email,
        updatedBooking.customerId.name,
        updatedBooking.restaurantId.name,
        updatedBooking.tableId.tableNumber,
        "confirmed",
        {
          startTime: updatedBooking.startTime,
          endTime: updatedBooking.endTime,
          totalPeople: updatedBooking.totalPeople,
          specialRequests: updatedBooking.specialRequests,
        },
      );
      await Booking.updateOne(
        { _id: updatedBooking._id },
        { $set: { hasNotified: true } },
      );
    }

    if (updatedBooking.status === "cancelled") {
      await sendBookingEmail(
        updatedBooking.customerId.email,
        updatedBooking.customerId.name,
        updatedBooking.restaurantId.name,
        updatedBooking.tableId.tableNumber,
        "cancelled",
        {
          startTime: updatedBooking.startTime,
          endTime: updatedBooking.endTime,
          totalPeople: updatedBooking.totalPeople,
          specialRequests: updatedBooking.specialRequests,
        },
      );
    }

    return res.status(200).json({
      booking: updatedBooking,
    });
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.log("Update booking failed:", error);
    }

    return res.status(500).json({
      message: "Update booking failed",
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingIds } = req.params;

    if (!bookingIds && !Array.isArray(bookingIds)) {
      return res.status(400).json({
        message: "Invalid booking IDs",
      });
    }

    const restaurant = await Restaurant.findOne({
      ownerId: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const bookings = await Booking.find({
      bookingId: { $in: bookingIds },
      restaurantId: restaurant._id,
    });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const deletedBookings = await Booking.deleteMany({
      _id: { $in: bookings.map((b) => b._id) },
    });

    return res.status(200).json({
      message: `${deletedBookings.deletedCount} booking(s) deleted successfully`,
      deletedBookingsCount: deletedBookings.deletedCount,
    });
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.log("Delete booking failed:", error);
    }

    return res.status(500).json({
      message: "Delete booking failed",
    });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      ownerId: req.user._id,
    });

    if (!restaurant) {
      return res.status(400).json({
        message: "Restaurant not found",
      });
    }

    const customers = await Customer.find({
      restaurantId: restaurant._id,
    });

    return res.status(200).json({
      customers,
    });
  } catch (error) {
    if (env.NODE_ENV === "development") {
      console.log("Get all customers failed:", error);
    }

    return res.status(500).json({
      message: "Get all customers failed",
    });
  }
};
