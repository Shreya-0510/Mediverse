import Appointment from "../models/appointment.model.js";

// Generate available slots for a doctor in a clinic
export const generateAvailableSlots = async (doctorId, clinic) => {
  const { startTime, endTime, avgAppointmentTime } = clinic;

  // Convert "HH:MM" to Date objects today
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const slots = [];
  const now = new Date();

  const slotDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    startHour,
    startMin
  );

  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    endHour,
    endMin
  );

  while (slotDate < endDate) {
    slots.push(new Date(slotDate));
    slotDate.setMinutes(slotDate.getMinutes() + avgAppointmentTime);
  }

  // ✅ FIX: avoid mutating same date object
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Filter out already booked slots
  const appointments = await Appointment.find({
    doctor: doctorId,
    clinic: clinic._id,
    startTime: { $gte: startOfDay },
    endTime: { $lte: endOfDay }
  });

  const bookedTimes = appointments.map(a => a.startTime.getTime());

  const availableSlots = slots.filter(
    slot => !bookedTimes.includes(slot.getTime())
  );

  return availableSlots;
};