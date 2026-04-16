export interface DoctorAvailabilityDTO {
  day: string; // "Monday", "Tuesday"
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable?: boolean;
}

export interface DoctorAvailabilityResponse {
  _id: string;
  doctor: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}