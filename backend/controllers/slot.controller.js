import Doctor from "../models/doctor.model.js";
import Clinic from "../models/clinic.model.js";
import { generateAvailableSlots } from "../utils/slotGenerator.js";

// GET /doctors/:id/available-slots
export const getDoctorAvailableSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("clinic");
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const slots = await generateAvailableSlots(doctor._id, doctor.clinic);

    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};