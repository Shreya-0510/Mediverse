import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} from "../controllers/appointment.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Patients create appointment for themselves
router.post("/", protect, authorize(["patient"]), createAppointment);

// Get appointments for logged-in user (patient or doctor)
router.get("/", protect, authorize(["doctor", "patient"]), getAppointments);

// Doctors update appointment status
router.patch("/:id", protect, authorize(["doctor"]), updateAppointmentStatus);

export default router;