import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "react-hot-toast";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export const useBookingStore = create((set) => ({
  bookings: [],
  booking: null,
  customers: [],
  isBookingLoading: false,
  bookingError: null,
  isBookingCreating: false,
  bookingCreatingError: null,
  isBookingUpdating: false,
  isPublicBookingLoading: false,
  publicBookingError: null,
  publicBooking: null,
  isCustomerLoading: false,
  customerError: null,

  fetchBookings: async () => {
    set({ isBookingLoading: true, bookingError: null });

    try {
      const response = await api.get("/api/bookings");
      set({ bookings: response.data.bookings ?? [] });
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch bookings");
      set({ bookingError: message });
      throw error;
    } finally {
      set({ isBookingLoading: false });
    }
  },

  updateBooking: async (bookingId, bookingData) => {
    set({ isBookingUpdating: true });

    try {
      const response = await api.patch(
        `/api/bookings/${bookingId}`,
        bookingData,
      );

      const updatedBooking = response.data.booking;

      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, ...updatedBooking }
            : booking,
        ),
        booking: updatedBooking,
      }));

      toast.success("Booking updated successfully");
      return updatedBooking;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update booking");

      toast.error(message);
      throw error;
    } finally {
      set({ isBookingUpdating: false });
    }
  },

  createBooking: async (bookingData) => {
    set({ isBookingCreating: true, bookingCreatingError: null });

    try {
      const response = await api.post("/api/bookings", bookingData);
      toast.success("Booking created successfully");
      set({ booking: response.data.booking });
      return response.data.booking;
    } catch (error) {
      set({
        bookingCreatingError: getErrorMessage(
          error,
          "Failed to create booking",
        ),
      });
      throw error;
    } finally {
      set({ isBookingCreating: false });
    }
  },

  getOneBooking: async (bookingId) => {
    set({ isBookingLoading: true, bookingError: null });

    try {
      const response = await api.get(`/api/bookings/${bookingId}`);
      set({ booking: response.data.booking });
    } catch (error) {
      set({
        bookingError: getErrorMessage(error, "Failed to fetch booking"),
      });
      throw error;
    } finally {
      set({ isBookingLoading: false });
    }
  },

  publicGetBooking: async (restaurantId, bookingId) => {
    set({
      isPublicBookingLoading: true,
      publicBookingError: null,
    });

    try {
      const response = await api.get(
        `/api/bookings/public/${restaurantId}/${bookingId}`,
      );

      set({ publicBooking: response.data.booking });
      return response.data.booking;
    } catch (error) {
      set({
        publicBookingError: getErrorMessage(error, "Failed to fetch booking"),
      });
      throw error;
    } finally {
      set({ isPublicBookingLoading: false });
    }
  },

  getAllCustomers: async () => {
    set({ isCustomerLoading: true, customerError: null });

    try {
      const response = await api.get("/api/bookings/customers");
      set({ customers: response.data.customers });
    } catch (error) {
      set({
        customerError: getErrorMessage(error, "Failed to fetch customers"),
      });
      throw error;
    } finally {
      set({ isCustomerLoading: false });
    }
  },
}));
