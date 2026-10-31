import { Router } from "express";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  publicGetRestaurant,
} from "../controllers/restaurant.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

export const restaurantRouter = Router();

restaurantRouter.post("/", verifyToken, isAdmin, createRestaurant);
restaurantRouter.get("/", verifyToken, getRestaurant);

restaurantRouter.patch("/", verifyToken, isAdmin, updateRestaurant);

restaurantRouter.get("/public/:restaurantId", publicGetRestaurant);

export default restaurantRouter;
