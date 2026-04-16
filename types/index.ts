import { LucideIcon } from 'lucide-react'
export * from "./user";
export * from "./doctor";
export * from "./appointment.types";
export * from "./medicalRecord";
export * from "./mongoose.type";
export * from "./errors";



export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}
export interface Stat {
  value: string
  label: string
}