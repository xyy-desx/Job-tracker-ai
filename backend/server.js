import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import automationRoutes from "./routes/automations.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/automations", automationRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("✅ API is running..."));

app.use((err, req, res, next) => {
  console.error("❌ Error:", err?.stack ?? err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
