export interface CreateDoctorDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  specialization: string;
  experience?: number;

  bio?: string;
  clinicAddress?: string;
  consultationFee?: number;
}

/* =========================
   UPDATE DTO (FIXED - YOU WERE MISSING THIS)
========================= */
export interface UpdateDoctorDTO {
  firstName?: string;
  lastName?: string;

  specialization?: string;
  experience?: number;

  bio?: string;
  clinicAddress?: string;
  consultationFee?: number;

  availability?: "available" | "unavailable";
  hospital?: string;

  isVerified?: boolean;
}

/* =========================
   DASHBOARD TYPES
========================= */
export interface DoctorDashboardStats {
  totalPatients: number;
  totalAppointments: number;
  totalReviews: number;
}

export interface DoctorProfileResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  experience: number;

  bio?: string;
  clinicAddress?: string;
  consultationFee?: number;

  availability: "available" | "unavailable";
  hospital?: string;

  isVerified: boolean;
}

export interface DoctorDashboardResponse {
  doctor: {
    name: string;
    specialization: string;
    verified: boolean;
  };

  stats: DoctorDashboardStats;
}