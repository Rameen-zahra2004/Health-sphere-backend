import mongoose from "mongoose";
import MedicalRecord from "../models/medicalRecord";

/* ================= TYPES ================= */
interface CreateMedicalRecordInput {
  patient: string;
  disease: string;
  symptoms: string;
  description: string;
}

interface UpdateMedicalRecordInput {
  disease?: string;
  symptoms?: string;
  description?: string;
}

/* ================= SERVICE ================= */
export const medicalRecordService = {
  /* ================= CREATE ================= */
  createRecord: async (data: CreateMedicalRecordInput) => {
    const record = await MedicalRecord.create(data);
    return record;
  },

  /* ================= GET MY RECORDS ================= */
  getMyRecords: async (patientId: string) => {
    return await MedicalRecord.find({ patient: patientId }).sort({
      createdAt: -1,
    });
  },

  /* ================= GET ALL ================= */
  getAllRecords: async () => {
    return await MedicalRecord.find()
      .populate("patient", "firstName lastName email")
      .sort({ createdAt: -1 });
  },

  /* ================= GET BY ID ================= */
  getById: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid medical record ID");
    }

    return await MedicalRecord.findById(id);
  },

  /* ================= UPDATE ================= */
  updateRecord: async (id: string, data: UpdateMedicalRecordInput) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid medical record ID");
    }

    return await MedicalRecord.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  /* ================= DELETE ================= */
  deleteRecord: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid medical record ID");
    }

    return await MedicalRecord.findByIdAndDelete(id);
  },
};