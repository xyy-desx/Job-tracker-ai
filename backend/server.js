// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import automationRoutes from "./routes/automations.js"; // <- this is correct

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Use the automation routes
app.use("/api/automations", automationRoutes);

// Health check
app.get("/", (req, res) => res.send("✅ API is running..."));

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err?.stack ?? err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
