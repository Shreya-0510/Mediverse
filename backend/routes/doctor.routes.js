import express from "express";
import { createDoctor, getDoctorById, searchDoctors } from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/", createDoctor);
router.get("/", searchDoctors);
router.get("/:id", getDoctorById);

export default router;