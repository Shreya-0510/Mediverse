import express from "express";
import {
  createPatient,
  getPatientById,
  searchPatients
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/", searchPatients);
router.get("/:id", getPatientById);

export default router;