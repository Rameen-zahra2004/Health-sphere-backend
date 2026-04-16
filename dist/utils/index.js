"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.formatDate = formatDate;
exports.formatPhoneNumber = formatPhoneNumber;
exports.truncate = truncate;
exports.slugify = slugify;
exports.getInitials = getInitials;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
/* =============================
   🎯 ClassName Utility (Tailwind-safe)
============================= */
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
/* =============================
   📅 Date Formatter (Safe)
============================= */
function formatDate(date) {
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
function formatPhoneNumber(phone) {
    if (!phone)
        return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
        return phone; // fallback instead of breaking
    }
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (!match)
        return phone;
    return `(${match[1]}) ${match[2]}-${match[3]}`;
}
/* =============================
   ✂️ Safe String Truncate
============================= */
function truncate(str, length) {
    if (!str)
        return "";
    if (length <= 0)
        return "";
    return str.length <= length ? str : `${str.slice(0, length)}...`;
}
/* =============================
   🔗 SEO-friendly Slug Generator
============================= */
function slugify(str) {
    if (!str)
        return "";
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
function getInitials(name) {
    if (!name)
        return "";
    return name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2);
}
