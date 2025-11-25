import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./db/database.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
import taskRoute from "./routes/tasks.js";
import cors from "cors";
import userRoute from "./routes/routesForUsers.js";
import cookieParser from "cookie-parser";

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-manager-client-brown.vercel.app"
    ],
    credentials: true,
  })
);

app.use("/", userRoute);

app.use("/", taskRoute);

app.use("/", (req, res) => {
  res.send("Test Server Is Running");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port: ${PORT}`);
});
