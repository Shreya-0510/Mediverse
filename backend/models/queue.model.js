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
    status: {
      type: String,
      enum: ["waiting", "in-progress", "done"],
      default: "waiting"
    }
  },
  { timestamps: true }
);

const Queue = mongoose.model("Queue", queueSchema);
export default Queue;