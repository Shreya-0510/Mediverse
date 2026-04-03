import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    specialty: {
      type: String,
      required: true,
      trim: true
    },
    contact: {
      type: String,
      trim: true
    },
    availableSlots: {
      type: [Date], 
      default: []
    },
    clinic: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Clinic",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;