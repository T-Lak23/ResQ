import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.route.js";
import { restaurantRouter } from "./routes/restaurant.route.js";
import cookieParser from "cookie-parser";
import bookingRouter from "./routes/booking.route.js";
import { tableRouter } from "./routes/table.route.js";

// To test tables and bookings

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/tables", tableRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log("Server started on port,", PORT);
});
