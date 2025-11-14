import express from "express";
const app = express();
import dotenv from "dotenv";
import connectDB from "./db/database.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
import taskRoute from "./routes/tasks.js"
import cors from "cors";


connectDB();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/api/v1/", taskRoute);

app.use("/", (req, res) => {
  res.send("Test Server Is Running")
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port: ${PORT}`)
});