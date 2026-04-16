import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* =============================
   🎯 ClassName Utility (Tailwind-safe)
============================= */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/* =============================
   📅 Date Formatter (Safe)
============================= */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/* =============================
   📞 Phone Formatter (Safe + Flexible)
============================= */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length !== 10) {
    return phone; // fallback instead of breaking
  }

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (!match) return phone;

  return `(${match[1]}) ${match[2]}-${match[3]}`;
}

/* =============================
   ✂️ Safe String Truncate
============================= */
export function truncate(str: string, length: number): string {
  if (!str) return "";
  if (length <= 0) return "";

  return str.length <= length ? str : `${str.slice(0, length)}...`;
}

/* =============================
   🔗 SEO-friendly Slug Generator
============================= */
export function slugify(str: string): string {
  if (!str) return "";

  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/-+/g, "-") // multiple dashes → single
    .replace(/^-|-$/g, ""); // trim dashes
}

/* =============================
   👤 Get User Initials (Safe)
============================= */
export function getInitials(name: string): string {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}