import { Router } from "express";
import {
  createTables,
  createManyTables,
  updateTable,
  getTables,
  getOneTable,
  deleteTable,
  getPublicTables,
} from "../controllers/table.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
export const tableRouter = Router();

tableRouter.post("/create", verifyToken, createTables);
tableRouter.post("/create-many", verifyToken, createManyTables);
tableRouter.patch("/update/:id", verifyToken, updateTable);
tableRouter.get("/", verifyToken, getTables);
tableRouter.get("/:id", verifyToken, getOneTable);
tableRouter.get("/public/:restaurantId", getPublicTables);
tableRouter.delete("/delete", verifyToken, deleteTable);
