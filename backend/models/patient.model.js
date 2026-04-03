import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
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
    }
}, {timestamps: true})

const Patient = new mongoose.model("Patient", patientSchema);

export default Patient;