export interface PatientAddress {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}

export interface EmergencyContact {
  name?: string | null;
  phone?: string | null;
  relation?: string | null;
}

/* ================= MAIN PATIENT TYPE ================= */
export interface Patient {
  _id: string;
  userId: string;

  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  address?: PatientAddress | null;
  emergencyContact?: EmergencyContact | null;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}