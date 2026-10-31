import api from "@/lib/api";
import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useRestaurantStore = create((set) => ({
  isRestaurantLoading: false,
  isRestaurantCreating: false,
  restaurantCreateError: null,
  restaurant: null,
  settings: null,
  restaurantError: null,
  isPublicRestaurantLoading: false,
  publicRestaurant: null,
  publicRestaurantError: null,
  publicRestaurantSettings: null,
  isRestaurantUpdating: false,

  loadRestaurant: async () => {
    set({ isRestaurantLoading: true });
    try {
      const response = await api.get("/api/restaurants");
      const data = await response.data;
      set({
        restaurant: data.restaurant,
        settings: data.settings,
      });
    } catch (error) {
      set({
        restaurantError:
          error.response?.data?.message ||
          error.message ||
          "Failed to load restaurant",
      });
      throw error;
    } finally {
      set({ isRestaurantLoading: false });
    }
  },

  createRestaurant: async (restaurantData) => {
    set({ isRestaurantCreating: true, restaurantCreateError: null });
    try {
      const response = await api.post("/api/restaurants", restaurantData);
      const data = await response.data;
      set({
        restaurant: data.restaurant,
        settings: data.settings,
      });
      toast.success("Restaurant created successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create restaurant",
      );
      set({
        restaurantCreateError:
          error.response?.data?.message ||
          error.message ||
          "Failed to create restaurant",
      });
      throw error;
    } finally {
      set({ isRestaurantCreating: false });
    }
  },

  publicGetRestaurant: async (restaurantId) => {
    set({ isPublicRestaurantLoading: true });
    try {
      const response = await api.get(`/api/restaurants/public/${restaurantId}`);
      const data = await response.data;
      set({
        publicRestaurant: data.restaurant,
        publicRestaurantSettings: data.settings,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load restaurant",
      );
      set({
        publicRestaurantError:
          error.response?.data?.message ||
          error.message ||
          "Failed to load restaurant",
      });
      throw error;
    } finally {
      set({ isPublicRestaurantLoading: false });
    }
  },
  updateRestaurant: async (restaurantData) => {
    set({ isRestaurantUpdating: true });
    try {
      const response = await api.patch("/api/restaurants", restaurantData);
      const data = await response.data;
      set({
        restaurant: data.restaurant,
        settings: data.settings,
      });
      toast.success("Restaurant updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update restaurant",
      );
      set({
        restaurantError:
          error.response?.data?.message ||
          error.message ||
          "Failed to update restaurant",
      });
      throw error;
    } finally {
      set({ isRestaurantUpdating: false });
    }
  },
}));
