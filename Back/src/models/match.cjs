"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScoreSchema = exports.createMatchSchema = void 0;
var zod_1 = require("zod");
// 🔹 Schema pour créer un match
var createMatchSchema = zod_1.z.object({
    date: zod_1.z.string(), // YYYY-MM-DD
    hour: zod_1.z.string(), // HH:MM
    opponent: zod_1.z.string().min(1), // nom du club adverse
    location: zod_1.z.enum(["Home", "Outside"]), // type de lieu
    type: zod_1.z.enum(["Championship", "Friendly", "Cup"]), // type de match
    id_team: zod_1.z.number().int().positive(), // équipe (id)
    id_coach: zod_1.z.number().int().nullable().optional(), // facultatif
    score_home: zod_1.z.number().int().min(0).default(0), // score domicile par défaut 0
    score_outside: zod_1.z.number().int().min(0).default(0), // score extérieur par défaut 0          // note facultative
});
exports.createMatchSchema = createMatchSchema;
// 🔹 Schema pour mettre à jour les scores uniquement
var updateScoreSchema = zod_1.z.object({
    score_home: zod_1.z.number().int().min(0),
    score_outside: zod_1.z.number().int().min(0),
});
exports.updateScoreSchema = updateScoreSchema;
