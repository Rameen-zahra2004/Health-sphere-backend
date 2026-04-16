export interface CreateDoctorDTO {
  name: string;
  email: string;
  password: string;

  specialization?: string;
  experience?: number;
  bio?: string;
  clinicAddress?: string;
  consultationFee?: number;
}

export interface UpdateDoctorDTO {
  name?: string;
  specialization?: string;
  experience?: number;
  bio?: string;
  clinicAddress?: string;
  consultationFee?: number;
}