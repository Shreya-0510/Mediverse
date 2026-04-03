import express from "express";
import {
  getPatientById,
  searchPatients
} from "../controllers/patient.controller.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize(["doctor"]), searchPatients);
router.get("/:id", protect, authorize(["doctor", "patient"]), getPatientById);

export default router;