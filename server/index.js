import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js"
import questionroute from "./routes/question.js"
import answerroutes from "./routes/answer.js"
import airoutes from "./routes/ai.js"
import articleroutes from "./routes/article.js"
import fs from "fs";

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ensure uploads dir exists and serve it
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));
app.get("/", (req, res) => {
  res.send("Stackoverflow clone is running perfect");
});
app.use('/user', userroutes)
app.use('/question', questionroute)
app.use('/answer', answerroutes)
app.use('/ai', airoutes)
app.use('/article', articleroutes)
const PORT = process.env.PORT;
const databaseurl = process.env.MONGODB_URL;

mongoose
  .connect(databaseurl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
