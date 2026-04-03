import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    clinicId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true
    },
    status: {
      type: String,
      enum: ["waiting", "in-progress", "done"],
      default: "waiting"
    }
  },
  { timestamps: true }
);

// Add index for fast doctor + status lookups**
queueSchema.index({ doctorId: 1, status: 1 });

const Queue = mongoose.model("Queue", queueSchema);
export default Queue;