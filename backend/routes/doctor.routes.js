import express from "express";
import { getDoctorById, searchDoctors } from "../controllers/doctor.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import { getDoctorAvailableSlots } from "../controllers/slot.controller.js";

const router = express.Router();

// Only logged-in users can search doctors
router.get("/", protect, authorize(["doctor", "patient"]), searchDoctors);

// Get specific doctor by ID (doctor or patient)
router.get("/:id", protect, authorize(["doctor", "patient"]), getDoctorById);

// Get available slots for a doctor
router.get("/:id/available-slots", protect, authorize(["doctor", "patient"]), getDoctorAvailableSlots);

export default router;