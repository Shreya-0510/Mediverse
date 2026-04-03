import Appointment from "../models/appointment.model.js";
import Queue from "../models/queue.model.js";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import { generateAvailableSlots } from "../utils/slotGenerator.js";

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, clinicId, startTime } = req.body;

    // Get the patient document if the user is a patient
    let patientDoc;
    if (req.user.role === "patient") {
      patientDoc = await Patient.findOne({ user: req.user._id });
      if (!patientDoc)
        return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const patientId = patientDoc ? patientDoc._id : req.body.patientId;

    // Fetch doctor + clinic
    const doctor = await Doctor.findById(doctorId).populate("clinic");
    if (!doctor)
      return res.status(404).json({ success: false, message: "Doctor not found" });

    // Generate valid slots
    const validSlots = await generateAvailableSlots(doctorId, doctor.clinic);

    // Validate slot
    const isValidSlot = validSlots.some(
      slot => slot.getTime() === new Date(startTime).getTime()
    );

    if (!isValidSlot) {
      return res.status(400).json({
        success: false,
        message: "Invalid or already booked slot"
      });
    }

    // Compute endTime (backend controlled)
    const computedEndTime = new Date(
      new Date(startTime).getTime() +
      doctor.clinic.avgAppointmentTime * 60000
    );

    // Create appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      clinic: clinicId,
      startTime,
      endTime: computedEndTime
    });

    // Add/update patient in queue
    await Queue.findOneAndUpdate(
      { patientId, doctorId, clinicId },
      { status: "waiting" },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all appointments for logged-in user
export const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "patient") {
      const patientDoc = await Patient.findOne({ user: req.user._id });
      if (!patientDoc)
        return res.status(404).json({ success: false, message: "Patient profile not found" });
      query.patient = patientDoc._id;
    } else if (req.user.role === "doctor") {
      query.doctor = req.user.doctor;
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "user dob contact")
      .populate("doctor", "user specialty contact")
      .populate("clinic", "name location");

    res.status(200).json({
      success: true,
      results: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment status (doctor only)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["scheduled", "confirmed", "canceled", "completed"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, doctor: req.user.doctor },
      { status },
      { new: true }
    );

    if (!appointment)
      return res.status(404).json({
        success: false,
        message: "Appointment not found or unauthorized"
      });

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};