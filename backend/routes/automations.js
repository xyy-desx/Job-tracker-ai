// backend/routes/automations.js
import { Router } from "express";
import pool from "../db/connect.js";

const router = Router();

// 🔹 GET: Application Status Data
router.get("/status", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT name, value FROM status_data");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 🔹 GET: Job Board Usage
router.get("/job-boards", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT name, usage FROM job_board_data");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 🔹 GET: Recent Applications
router.get("/recent-applications", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, company, position, source, date, status, automation, salary, location, notes
       FROM recent_applications
       ORDER BY date DESC
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 🔹 POST: Add New Application
router.post("/recent-applications", async (req, res, next) => {
  try {
    let { company, position, source, date, status, notes, automation, salary, location } = req.body;
    salary = salary ? Number(salary) : 0;

    const { rows } = await pool.query(
      `INSERT INTO recent_applications 
        (company, position, source, date, status, notes, automation, salary, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [company, position, source, date, status, notes, automation || "Manual", salary, location || null]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error inserting application:", err);
    next(err);
  }
});

// 🔹 DELETE: Remove an application by ID
router.delete("/recent-applications/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM recent_applications WHERE id = $1", [id]);

    if (rowCount === 0) return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// 🔹 PATCH: Update application by ID
router.patch("/recent-applications/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, salary, notes, location, company, position, source, automation, date } = req.body;

    const fields = [];
    const values = [];
    let idx = 1;

    if (company !== undefined) { fields.push(`company=$${idx++}`); values.push(company); }
    if (position !== undefined) { fields.push(`position=$${idx++}`); values.push(position); }
    if (source !== undefined) { fields.push(`source=$${idx++}`); values.push(source); }
    if (date !== undefined) { fields.push(`date=$${idx++}`); values.push(date); }
    if (status !== undefined) { fields.push(`status=$${idx++}`); values.push(status); }
    if (automation !== undefined) { fields.push(`automation=$${idx++}`); values.push(automation); }
    if (salary !== undefined) { fields.push(`salary=$${idx++}`); values.push(Number(salary)); }
    if (location !== undefined) { fields.push(`location=$${idx++}`); values.push(location); }
    if (notes !== undefined) { fields.push(`notes=$${idx++}`); values.push(notes); }

    if (fields.length === 0) return res.status(400).json({ message: "No fields provided to update" });

    const { rows } = await pool.query(
      `UPDATE recent_applications SET ${fields.join(", ")} WHERE id=$${idx} RETURNING *`,
      [...values, id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Application not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to update application:", err);
    next(err);
  }
});

// 🔹 NEW: GET Automation Logs
router.get("/logs", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, source, action, status, details, date
       FROM automation_logs
       ORDER BY date DESC
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch automation logs:", err);
    next(err);
  }
});

// 🔹 NEW: GET Integrations Info
router.get("/integrations", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, from_app, to_app, status
       FROM automation_integrations`
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch integrations:", err);
    next(err);
  }
});

export default router;
