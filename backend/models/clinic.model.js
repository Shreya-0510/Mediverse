import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        // timings can be daily start/end, or for MVP just overall clinic hours
        startTime: {
            type: String,
            required: true
        }, // e.g., "09:00"
        endTime: {
            type: String,
            required: true
        },   // e.g., "17:00"
        doctors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor"
        }], // optional
        avgAppointmentTime: { type: Number, default: 15 }, // in minutes
    }, { timestamps: true });

const Clinic = mongoose.model("Clinic", clinicSchema);
export default Clinic;