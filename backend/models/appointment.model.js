import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient", required: true
        },
        doctor: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Doctor", required: true 
        },
        clinic: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Clinic", required: true 
        },
        startTime: { 
            type: Date, 
            required: true 
        },
        endTime: { 
            type: Date, 
            required: true 
        },
        status: {
            type: String,
            enum: ["scheduled", "confirmed", "canceled", "completed"],
            default: "scheduled",
        },
    }, { timestamps: true });

// Prevent overlapping appointments for the same doctor
appointmentSchema.pre("save", async function(next) {
  const Appointment = this.constructor;

  const overlapping = await Appointment.findOne({
    doctor: this.doctor,
    startTime: { $lt: this.endTime },
    endTime: { $gt: this.startTime },
    status: { $in: ["scheduled", "confirmed"] }
  });

  if (overlapping) {
    return next(new Error("Doctor already has an appointment during this time"));
  }

  next();
});


const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;