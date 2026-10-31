import { Restaurant } from "../models/restaurant.model.js";
import { Table } from "../models/table.model.js";
import mongoose from "mongoose";
export const createTables = async (req, res) => {
  try {
    const { tableNumber, capacity, status, isActive } = req.body;
    if (!tableNumber || !capacity) {
      return res
        .status(400)
        .json({ message: "Table number and capacity are required" });
    }
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const tableExists = await Table.findOne({
      restaurantId: restaurant._id,
      tableNumber,
    });

    if (tableExists) {
      return res.status(400).json({ message: "Table already exists" });
    }

    const table = new Table({
      restaurantId: restaurant._id,
      tableNumber: parseInt(tableNumber, 10),
      capacity: parseInt(capacity, 10),
      status: status || "available",
      isActive: isActive || true,
    });

    await table.save();

    res.status(201).json({ message: "Table created successfully", table });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createManyTables = async (req, res) => {
  try {
    const {
      tableNumbers,
      startingNumber,
      numberOfTables,
      capacity,
      status,
      isActive,
    } = req.body;

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const tables = [];

    if (startingNumber && numberOfTables) {
      const start = parseInt(startingNumber, 10);
      const count = parseInt(numberOfTables, 10);
      const existingTables = await Table.find({
        restaurantId: restaurant._id,
        tableNumber: {
          $gte: start,
          $lte: start + count - 1,
        },
      });

      if (existingTables.length > 0) {
        return res.status(400).json({
          message:
            "Some tables already exist, please choose different table numbers or delete the existing tables",
        });
      }

      for (let i = 0; i < count; i++) {
        tables.push({
          restaurantId: restaurant._id,
          tableNumber: start + i,
          capacity,
          status: status || "available",
          isActive: isActive || true,
        });
      }
    } else if (tableNumbers) {
      if (!Array.isArray(tableNumbers) || tableNumbers.length === 0) {
        return res
          .status(400)
          .json({ message: "Table numbers must be a non-empty" });
      }
      const uniqueAndNumericTableNumbers = [...new Set(tableNumbers)].map(
        (num) => parseInt(num, 10),
      );

      const existingTables = await Table.find({
        restaurantId: restaurant._id,
        tableNumber: {
          $in: uniqueAndNumericTableNumbers,
        },
      });

      if (existingTables.length > 0) {
        return res.status(400).json({
          message:
            "Some tables already exist, please choose different table numbers or delete the existing tables",
        });
      }
      uniqueAndNumericTableNumbers.forEach((tableNumber) => {
        tables.push({
          restaurantId: restaurant._id,
          tableNumber,
          capacity,
          status: status || "available",
          isActive: isActive || true,
        });
      });
    }

    const createdTables = await Table.insertMany(tables);

    res
      .status(201)
      .json({ message: "Tables created successfully", tables: createdTables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Table creation failed" });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid table ID" });
    }
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const table = await Table.findOne({
      _id: id,
      restaurantId: restaurant._id,
    });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    const { tableNumber, capacity, status, isActive } = req.body;

    const updatedTable = await Table.findOneAndUpdate(
      { _id: id, restaurantId: restaurant._id },
      {
        $set: {
          tableNumber,
          capacity,
          status,
          isActive,
        },
      },
      { returnDocument: "after" },
    );
    res
      .status(200)
      .json({ message: "Table updated successfully", table: updatedTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Table update failed" });
  }
};

export const getTables = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const tables = await Table.find({ restaurantId: restaurant._id }).sort({
      tableNumber: 1,
    });
    if (tables.length === 0) {
      return res.status(200).json({ tables: [], message: "No tables found" });
    }

    res.status(200).json({ tables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Table retrieval failed" });
  }
};

export const getPublicTables = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const tables = await Table.find({
      restaurantId: restaurant._id,
      isActive: true,
    }).sort({
      tableNumber: 1,
    });
    if (tables.length === 0) {
      return res.status(200).json({ tables: [], message: "No tables found" });
    }

    res.status(200).json({ tables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Table retrieval failed" });
  }
};

export const getOneTable = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid table ID" });
    }
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const table = await Table.findOne({
      _id: id,
      restaurantId: restaurant._id,
    });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ table });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Table retrieval failed" });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid table IDs" });
    }

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const tables = await Table.find({
      restaurantId: restaurant._id,
      _id: { $in: ids },
    });

    if (!tables || tables.length === 0) {
      return res.status(400).json({
        message: "No tables to delete",
      });
    }

    const deleted = await Table.deleteMany({
      _id: { $in: ids },
      restaurantId: restaurant._id,
    });

    res.status(200).json({
      message: `Deleted ${deleted.deletedCount} tables`,
      deletedCount: deleted.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Table deletion failed" });
  }
};
