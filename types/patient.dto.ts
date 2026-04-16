import type { PatientAddress, EmergencyContact } from "./patient";

/* ================= CREATE DTO ================= */
export interface CreatePatientDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  address?: PatientAddress;
  emergencyContact?: EmergencyContact;
}

/* ================= UPDATE DTO ================= */
export type UpdatePatientDTO = Partial<CreatePatientDTO>;