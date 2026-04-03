import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"]
    },
    symptoms: {
      type: [String],
      default: []
    },
    contact: {
      type: String,
      trim: true
    },
    clinic: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Clinic" 
    } // optional
  }, { timestamps: true })

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;