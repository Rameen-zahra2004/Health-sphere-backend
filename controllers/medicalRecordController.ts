import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import MedicalRecord from "../models/medicalRecord";
import Appointment from "../models/Appointment";

/* ================= RESPONSE HELPER ================= */
const sendResponse = <T>(
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: T
) => {
  return res.status(status).json({ success, message, data });
};

/* ================= SAFE ID HANDLER ================= */
const getSafeId = (id: string | string[] | undefined): string | null => {
  if (!id) return null;
  return Array.isArray(id) ? id[0] : id;
};

/* ================= CREATE MEDICAL RECORD ================= */
export const createMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appointment, disease, symptoms, description, status } = req.body;

    if (!appointment || !disease || !symptoms || !description) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    if (!mongoose.Types.ObjectId.isValid(appointment)) {
      return sendResponse(res, 400, false, "Invalid appointment ID");
    }

    const appt = await Appointment.findById(appointment);

    if (!appt) {
      return sendResponse(res, 404, false, "Appointment not found");
    }

    const existingRecord = await MedicalRecord.findOne({ appointment });

    if (existingRecord) {
      return sendResponse(
        res,
        409,
        false,
        "Medical record already exists for this appointment"
      );
    }

    const record = await MedicalRecord.create({
      patient: appt.patientId,
      appointment: appt._id,
      doctorAssigned: appt.doctorId,
      disease,
      symptoms,
      description,
      status,
    });

    return sendResponse(res, 201, true, "Medical record created", record);
  } catch (error) {
    next(error);
  }
};

/* ================= GET MY RECORDS ================= */
export const getMyRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as { id?: string; role?: string } | undefined;

    const records = await MedicalRecord.find({
      patient: user?.id,
    })
      .populate("appointment")
      .populate("doctorAssigned", "firstName lastName email")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Records fetched", records);
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL RECORDS ================= */
export const getAllRecords = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const records = await MedicalRecord.find()
      .populate("patient", "firstName lastName email")
      .populate("appointment")
      .populate("doctorAssigned", "firstName lastName email")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "All records fetched", records);
  } catch (error) {
    next(error);
  }
};

/* ================= GET SINGLE RECORD ================= */
export const getSingleRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = getSafeId(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid record ID");
    }

    const record = await MedicalRecord.findById(id)
      .populate("patient", "firstName lastName email")
      .populate("appointment")
      .populate("doctorAssigned", "firstName lastName email");

    if (!record) {
      return sendResponse(res, 404, false, "Record not found");
    }

    const user = req.user as { id?: string; role?: string } | undefined;

    if (
      user?.role === "patient" &&
      record.patient.toString() !== user.id
    ) {
      return sendResponse(res, 403, false, "Unauthorized access");
    }

    return sendResponse(res, 200, true, "Record fetched", record);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE RECORD ================= */
export const updateRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = getSafeId(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid record ID");
    }

    const record = await MedicalRecord.findById(id);

    if (!record) {
      return sendResponse(res, 404, false, "Record not found");
    }

    const user = req.user as { id?: string; role?: string } | undefined;

    if (
      user?.role === "patient" &&
      record.patient.toString() !== user.id
    ) {
      return sendResponse(res, 403, false, "Unauthorized");
    }

    const updated = await MedicalRecord.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return sendResponse(res, 200, true, "Record updated", updated);
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE RECORD ================= */
export const deleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = getSafeId(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid record ID");
    }

    const record = await MedicalRecord.findById(id);

    if (!record) {
      return sendResponse(res, 404, false, "Record not found");
    }

    await record.deleteOne();

    return sendResponse(res, 200, true, "Record deleted");
  } catch (error) {
    next(error);
  }
};