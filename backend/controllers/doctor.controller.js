import Doctor from "../models/doctor.model.js";
import Clinic from "../models/clinic.model.js";
import User from "../models/user.model.js";

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id)
      .populate("user", "username email")
      .populate("clinic", "name location startTime endTime avgAppointmentTime");

    if (!doctor)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search doctors by username or specialty
export const searchDoctors = async (req, res) => {
  try {
    const { search } = req.query;

    let doctors;
    if (search) {
      // Step 1: Find user IDs that match username
      const users = await User.find({
        username: { $regex: search, $options: "i" }
      });

      const userIds = users.map(u => u._id);

      // Step 2: Search doctors by specialty OR user IDs
      doctors = await Doctor.find({
        $or: [
          { specialty: { $regex: search, $options: "i" } },
          { user: { $in: userIds } }
        ]
      })
        .populate("user", "username email")
        .populate("clinic", "name location startTime endTime avgAppointmentTime");
    } else {
      // No search query: return all doctors
      doctors = await Doctor.find()
        .populate("user", "username email")
        .populate("clinic", "name location startTime endTime avgAppointmentTime");
    }

    res.status(200).json({ success: true, results: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};