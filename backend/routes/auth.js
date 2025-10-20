import { Router } from "express";
import pool from "../db/connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Change these as needed
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    // Check for user existence
    const exist = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, name, hashed]
    );
    res.status(201).json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
