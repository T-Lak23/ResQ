import { Restaurant } from "../models/restaurant.model.js";
import { Settings } from "../models/settings.model.js";
import mongoose from "mongoose";

export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      logo,
      capacity,
      openingTime,
      closingTime,
      blockedDates,
    } = req.body;

    if (!name || !address || !phone || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isRestaurantExists = await Restaurant.findOne({ email });

    if (isRestaurantExists) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const restaurant = new Restaurant({
      ownerId: req.user._id,
      name,
      address,
      phone,
      email,
      logo,
      menu: [],
    });
    await restaurant.save();

    const settings = new Settings({
      restaurantId: restaurant._id,
      openingTime,
      closingTime,
      blockedDates,
    });
    await settings.save();

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Restaurant server error" });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      ownerId: req.user._id,
    }).populate("ownerId");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const settings = await Settings.findOne({
      restaurantId: restaurant._id,
    });
    res.status(200).json({ restaurant, settings });
  } catch (error) {
    res.status(500).json({ message: " Restaurant server error" });
  }
};

export const publicGetRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
    }).populate("ownerId");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const settings = await Settings.findOne({
      restaurantId: restaurant._id,
    });
    if (!settings) {
      return res.status(404).json({ message: "Restaurant cannot be accessed" });
    }
    if (!settings.isOpen) {
      return res
        .status(404)
        .json({ message: "Restaurant is currently closed" });
    }
    res.status(200).json({ restaurant, settings });
  } catch (error) {
    res.status(500).json({ message: " Restaurant server error" });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      ownerId: req.user._id,
    }).populate("ownerId");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const {
      name,
      address,
      phone,
      email,
      logo,
      menu,
      capacity,
      openingTime,
      closingTime,
      blockedDates,
      isOpen,
    } = req.body;

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: restaurant._id },
      { $set: { name, address, phone, email, logo, menu } },
      { returnDocument: "after" },
    );

    const updatedSetting = await Settings.findOneAndUpdate(
      { restaurantId: restaurant._id },
      {
        $set: {
          capacity,
          openingTime,
          closingTime,
          blockedDates,
          isOpen,
        },
      },
      { returnDocument: "after" },
    );

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
      settings: updatedSetting,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Restaurant server error" });
  }
};
