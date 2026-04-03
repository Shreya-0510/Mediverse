import express from "express";
import { getDoctorById, searchDoctors } from "../controllers/doctor.controller.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize(["doctor", "patient"]), searchDoctors);
router.get("/:id", protect, authorize(["doctor"]), getDoctorById);

export default router;