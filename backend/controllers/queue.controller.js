import Queue from "../models/queue.model.js";

// Add patient to queue
export const addToQueue = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    const queueItem = await Queue.create({ patientId, doctorId });
    res.status(201).json({ success: true, data: queueItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get queue for a doctor
export const getQueueByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const queue = await Queue.find({ doctorId, status: "waiting" })
      .populate("patientId", "name dob contact")
      .sort({ createdAt: 1 }); // FIFO order

    res.status(200).json({ success: true, results: queue.length, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update queue status (e.g., mark in-progress or done)
export const updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["waiting", "in-progress", "done"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const updatedItem = await Queue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};