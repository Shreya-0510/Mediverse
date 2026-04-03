import express from "express";
import {
  addToQueue,
  getQueueByDoctor,
  updateQueueStatus
} from "../controllers/queue.controller.js";

const router = express.Router();

// Add patient to queue
router.post("/", addToQueue);

// Get queue for a specific doctor
router.get("/doctor/:doctorId", getQueueByDoctor);

// Update queue status
router.patch("/:id", updateQueueStatus);

export default router;