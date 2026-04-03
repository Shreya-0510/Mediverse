import Doctor from "../models/doctor.model.js";

// Create a doctor
export const createDoctor = async (req, res) => {
  try {
    const { name, specialty, contact, availableSlots } = req.body;

    const doctor = await Doctor.create({
      name,
      specialty,
      contact,
      availableSlots
    });

    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search doctors by name or specialty
export const searchDoctors = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { specialty: { $regex: search, $options: "i" } }
        ]
      };
    }

    const doctors = await Doctor.find(query);
    res.status(200).json({ success: true, results: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};