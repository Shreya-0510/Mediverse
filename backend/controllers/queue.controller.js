import Queue from "../models/queue.model.js";
import Clinic from "../models/clinic.model.js";
import Patient from "../models/patient.model.js";

// Add patient to queue
export const addToQueue = async (req, res) => {
  try {
    const { doctorId, clinicId } = req.body;
    const patientId = req.user.role === "patient" ? req.user._id : req.body.patientId;

    const queueItem = await Queue.create({ patientId, doctorId, clinicId });
    res.status(201).json({ success: true, data: queueItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get queue for a doctor, with ETA
export const getQueueByDoctor = async (req, res) => {
  try {
    const doctorId =
      req.user.role === "doctor" ? req.user._id : req.params.doctorId;

    const queue = await Queue.find({ doctorId })
      .populate("patientId", "user dob contact")
      .populate("clinicId", "name location avgAppointmentTime")
      .sort({ createdAt: 1 });

    if (queue.length === 0) {
      return res.status(200).json({ success: true, results: 0, data: [] });
    }

    const avgAppointmentTime =
      queue[0].clinicId?.avgAppointmentTime || 15;

    let cumulativeTime = 0;

    const queueWithEta = queue.map((item, index) => {
      let eta = cumulativeTime;

      // If previous patient is in-progress → reduce wait
      if (index === 0 && item.status === "in-progress") {
        eta = Math.floor(avgAppointmentTime / 2); // simple approximation
      }

      cumulativeTime += avgAppointmentTime;

      return {
        ...item._doc,
        position: index + 1,
        etaMinutes: eta
      };
    });

    res.status(200).json({
      success: true,
      results: queueWithEta.length,
      data: queueWithEta
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update queue status (doctor only)
export const updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["waiting", "in-progress", "done"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const updatedItem = await Queue.findOneAndUpdate(
      { _id: id, doctorId: req.user._id },
      { status },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current patient's queue status (position + ETA)
export const getMyQueueStatus = async (req, res) => {
  try {
    // Only patients allowed
    if (req.user.role !== "patient") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Get patient document
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Get full queue (same logic as doctor view)
    const queue = await Queue.find({ doctorId: { $exists: true } })
      .populate("clinicId", "name location avgAppointmentTime")
      .sort({ createdAt: 1 });

    // Find this patient in queue
    const index = queue.findIndex(
      item => item.patientId.toString() === patient._id.toString()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "You are not in any queue"
      });
    }

    const avgTime = queue[0].clinicId?.avgAppointmentTime || 15;

    let etaMinutes = index * avgTime;

    // Handle in-progress case
    if (index === 0 && queue[0].status === "in-progress") {
      etaMinutes = Math.floor(avgTime / 2);
    }

    const current = queue[index];

    res.status(200).json({
      success: true,
      data: {
        position: index + 1,
        etaMinutes,
        doctorId: current.doctorId,
        clinic: current.clinicId
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};