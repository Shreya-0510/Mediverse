import express from "express";
import { addToQueue, getQueueByDoctor, updateQueueStatus } from "../controllers/queue.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Patient adds themselves to a doctor's queue
router.post("/", protect, authorize(["patient"]), addToQueue);

// Doctor views their queue
router.get("/doctor", protect, authorize(["doctor"]), getQueueByDoctor);

// Doctor updates queue status
router.patch("/:id", protect, authorize(["doctor"]), updateQueueStatus);

// Get current patient's queue status (position + ETA)
router.get("/my", protect, authorize(["patient"]), getMyQueueStatus);

export default router;