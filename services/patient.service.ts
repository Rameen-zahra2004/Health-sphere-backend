import PatientModel from "../models/patient";
import type { Patient } from "../types/patient";
import type { CreatePatientDTO, UpdatePatientDTO } from "../types/patient.dto";

/* =========================
   STRICT MONGOOSE DOCUMENT TYPE
========================= */
type PatientDocument = {
  _id: { toString(): string };
  userId: { toString(): string };

  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  } | null;

  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  } | null;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/* =========================
   NORMALIZER (NO ANY)
========================= */
const normalizePatient = (p: PatientDocument): Patient => {
  return {
    _id: p._id.toString(),
    userId: p.userId.toString(),

    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    phone: p.phone,

    address: p.address
      ? {
          street: p.address.street ?? null,
          city: p.address.city ?? null,
          state: p.address.state ?? null,
          zipCode: p.address.zipCode ?? null,
        }
      : null,

    emergencyContact: p.emergencyContact
      ? {
          name: p.emergencyContact.name ?? null,
          phone: p.emergencyContact.phone ?? null,
          relation: p.emergencyContact.relation ?? null,
        }
      : null,

    isActive: p.isActive,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

/* =========================
   MY PROFILE
========================= */
export const getMyProfileService = async (
  userId: string
): Promise<Patient | null> => {
  const patient = await PatientModel.findOne({ userId }).lean<PatientDocument>();

  return patient ? normalizePatient(patient) : null;
};

/* =========================
   GET ALL PATIENTS
========================= */
export const getPatientsService = async (): Promise<Patient[]> => {
  const patients = await PatientModel.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean<PatientDocument[]>();

  return patients.map(normalizePatient);
};

/* =========================
   GET PATIENT BY ID
========================= */
export const getPatientByIdService = async (
  id: string
): Promise<Patient | null> => {
  const patient = await PatientModel.findById(id).lean<PatientDocument>();

  return patient ? normalizePatient(patient) : null;
};

/* =========================
   CREATE PATIENT
========================= */
export const createPatientService = async (
  data: CreatePatientDTO
): Promise<Patient> => {
  const patient = await PatientModel.create({
    ...data,
    isActive: true,
  });

  return normalizePatient(patient.toObject() as PatientDocument);
};

/* =========================
   UPDATE PATIENT
========================= */
export const updatePatientService = async (
  id: string,
  data: UpdatePatientDTO
): Promise<Patient | null> => {
  const patient = await PatientModel.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  ).lean<PatientDocument>();

  return patient ? normalizePatient(patient) : null;
};

/* =========================
   DELETE PATIENT (SOFT DELETE)
========================= */
export const deletePatientService = async (
  id: string
): Promise<Patient | null> => {
  const patient = await PatientModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).lean<PatientDocument>();

  return patient ? normalizePatient(patient) : null;
};