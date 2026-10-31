import { create } from "zustand";
import api from "../lib/api";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  isAuthLoading: false,
  error: null,
  authError: null,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setAuthError: (authError) => set({ authError }),

  register: async (email, password, name) => {
    set({ isAuthLoading: true, error: null });
    try {
      const response = await api.post("/api/auth/register", {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthLoading: false,
      });
      toast.success("Registration successful");
    } catch (error) {
      toast.error(error.response.data.message || "Registration failed");
      set({
        authError: error.response.data.message || "Registration failed",
        isAuthLoading: false,
        isAuthenticated: false,
      });
      throw error;
    } finally {
      set({ isAuthLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isAuthLoading: true, error: null });
    try {
      const response = await api.post("/api/auth/login", { email, password });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isAuthLoading: false,
      });
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.response.data.message || "Login failed");
      set({
        authError: error.response.data.message || "Login failed",
        isAuthLoading: false,
        isAuthenticated: false,
      });
      throw error;
    } finally {
      set({ isAuthLoading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/api/auth/me");

      set({
        user: response?.data?.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to fetch user",
        loading: false,
        isAuthenticated: false,
      });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ isAuthLoading: true, error: null });
    try {
      await api.post("/api/auth/logout");
      set({ user: null, isAuthenticated: false, isAuthLoading: false });
    } catch (error) {
      toast.error(error.response.data.message || "Logout failed");
      set({
        error: error.response.data.message || "Logout failed",
        isAuthLoading: false,
        isAuthenticated: false,
      });
    } finally {
      set({ isAuthLoading: false });
    }
  },
}));
