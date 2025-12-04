"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainingSchema = void 0;
var zod_1 = require("zod");
var createTrainingSchema = zod_1.z.object({
    date: zod_1.z.string().refine(function (s) { return !Number.isNaN(Date.parse(s)); }, { message: "Date invalide (YYYY-MM-DD)" }),
    heure: zod_1.z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Heure invalide (HH:MM ou HH:MM:SS)"),
    type: zod_1.z.string().min(1),
    lieu: zod_1.z.string().min(1),
    equipe: zod_1.z.string().min(1),
    id_coach: zod_1.z.number().int().positive().optional(),
});
exports.createTrainingSchema = createTrainingSchema;
