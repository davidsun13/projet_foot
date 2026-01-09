"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScoreSchema = exports.createMatchSchema = void 0;
var zod_1 = require("zod");
var createMatchSchema = zod_1.z.object({
    date: zod_1.z.string(),
    hour: zod_1.z.string(),
    opponent: zod_1.z.string().min(1),
    location: zod_1.z.string(),
    type: zod_1.z.string(),
    team: zod_1.z.string(),
    score_home: zod_1.z.number().optional().default(0),
    score_outside: zod_1.z.number().optional().default(0),
});
exports.createMatchSchema = createMatchSchema;
var updateScoreSchema = zod_1.z.object({
    score_home: zod_1.z.number().min(0),
    score_outside: zod_1.z.number().min(0),
});
exports.updateScoreSchema = updateScoreSchema;
