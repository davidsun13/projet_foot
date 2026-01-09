"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainingSchema = void 0;
var zod_1 = require("zod");
var createTrainingSchema = zod_1.z.object({
    date: zod_1.z.string().min(1),
    hour: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
    type: zod_1.z.string().min(1),
    team: zod_1.z.string().min(1),
});
exports.createTrainingSchema = createTrainingSchema;
