import { create } from "zustand";
import api from "../lib/api";
import { toast } from "react-hot-toast";

export const useTableStore = create((set, get) => ({
  tables: [],
  isTableLoading: false,
  isCreateTableLoading: false,
  tableError: null,
  createTableError: null,
  isUpdateTableLoading: false,
  updateTableError: null,
  isPublicTableLoading: false,
  publicTableError: null,
  publicTables: [],
  isDeleteTableLoading: false,
  deleteTableError: null,

  setCreateTableError: () => set({ createTableError: null }),
  setUpdateTableError: () => set({ updateTableError: null }),

  fetchTables: async () => {
    set({ isTableLoading: true });
    try {
      const response = await api.get("/api/tables");
      set({ tables: response.data.tables });
    } catch (error) {
      set({ tableError: error.message });
      throw error;
    } finally {
      set({ isTableLoading: false });
    }
  },

  createTables: async (tableData) => {
    set({ isCreateTableLoading: true });
    try {
      const response = await api.post("/api/tables/create-many", tableData);
      set({ tables: [...get().tables, ...response.data.tables] });
      toast.success("Table created successfully");
      return response.data.tables;
    } catch (error) {
      set({
        createTableError:
          error.response.data.message ||
          error.message ||
          "Failed to create table",
      });
      toast.error(
        error.response.data.message ||
          error.message ||
          "Failed to create table",
      );
      throw error;
    } finally {
      set({ isCreateTableLoading: false });
    }
  },
  createTable: async (tableData) => {
    set({ isCreateTableLoading: true });
    try {
      const response = await api.post("/api/tables/create", tableData);
      set({ tables: [...get().tables, response.data.table] });
      toast.success("Table created successfully");
      return response.data.table;
    } catch (error) {
      set({
        createTableError:
          error.response.data.message ||
          error.message ||
          "Failed to create table",
      });
      toast.error(
        error.response.data.message ||
          error.message ||
          "Failed to create table",
      );
      throw error;
    } finally {
      set({ isCreateTableLoading: false });
    }
  },
  updateTable: async (tableId, tableData) => {
    set({ isUpdateTableLoading: true });
    try {
      const response = await api.patch(
        `/api/tables/update/${tableId}`,
        tableData,
      );
      set({
        tables: get().tables.map((table) =>
          table._id === tableId ? response.data.table : table,
        ),
      });
      toast.success("Table updated successfully");
      return response.data.table;
    } catch (error) {
      set({
        updateTableError:
          error.response.data.message ||
          error.message ||
          "Failed to update table",
      });
      toast.error(
        error.response.data.message ||
          error.message ||
          "Failed to update table",
      );
      throw error;
    } finally {
      set({ isUpdateTableLoading: false });
    }
  },

  getPublicTables: async (restaurantId) => {
    set({ isPublicTableLoading: true });
    try {
      const response = await api.get(`/api/tables/public/${restaurantId}`);
      set({ publicTables: response.data.tables });
      return response.data.tables;
    } catch (error) {
      set({
        publicTableError:
          error.response.data.message ||
          error.message ||
          "Failed to fetch public tables",
      });
      toast.error(
        error.response.data.message ||
          error.message ||
          "Failed to fetch public tables",
      );
      throw error;
    } finally {
      set({ isPublicTableLoading: false });
    }
  },
  deleteTables: async (tableIds) => {
    set({ isDeleteTableLoading: true });
    try {
      const response = await api.delete("/api/tables/delete", {
        data: { ids: tableIds },
      });
      set({
        tables: get().tables.filter((table) => !tableIds.includes(table._id)),
      });
      toast.success("Tables deleted successfully");
      return response.data;
    } catch (error) {
      set({
        deleteTableError:
          error.response.data.message ||
          error.message ||
          "Failed to delete tables",
      });
      toast.error(
        error.response.data.message ||
          error.message ||
          "Failed to delete tables",
      );
      throw error;
    } finally {
      set({ isDeleteTableLoading: false });
    }
  },
}));
