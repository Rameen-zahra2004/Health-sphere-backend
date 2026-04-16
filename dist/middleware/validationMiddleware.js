"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validateBody = void 0;
const zod_1 = require("zod");
/* ================= ERROR FORMATTER ================= */
const formatErrors = (issues) => issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
}));
/* ================= BODY VALIDATION ================= */
const validateBody = (schema) => async (req, res, next) => {
    try {
        const parsed = await schema.parseAsync(req.body);
        req.validatedBody = parsed;
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: formatErrors(err.issues),
            });
        }
        next(err);
    }
};
exports.validateBody = validateBody;
/* ================= PARAMS VALIDATION ================= */
const validateParams = (schema) => async (req, res, next) => {
    try {
        const parsed = await schema.parseAsync(req.params);
        req.validatedParams = parsed;
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Params validation error",
                errors: formatErrors(err.issues),
            });
        }
        next(err);
    }
};
exports.validateParams = validateParams;
/* ================= QUERY VALIDATION ================= */
const validateQuery = (schema) => async (req, res, next) => {
    try {
        const parsed = await schema.parseAsync(req.query);
        req.validatedQuery = parsed;
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Query validation error",
                errors: formatErrors(err.issues),
            });
        }
        next(err);
    }
};
exports.validateQuery = validateQuery;
