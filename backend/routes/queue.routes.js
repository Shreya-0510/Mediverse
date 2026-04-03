import express from "express";
import {
  addToQueue,
  getQueueByDoctor,
  updateQueueStatus
} from "../controllers/queue.controller.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

// Add patient to queue
router.post("/", protect, authorize(["patient"]), addToQueue);

// Get queue for a specific doctor
router.get("/doctor/:doctorId", protect, authorize(["doctor"]), getQueueByDoctor);

// Update queue status
router.patch("/:id", protect, authorize(["doctor"]), updateQueueStatus);

export default router;