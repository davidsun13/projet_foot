"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
var zod_1 = require("zod");
var registerSchema = zod_1.z.object({
    surname: zod_1.z.string().min(1, "Le nom est requis"),
    name: zod_1.z.string().min(1, "Le prénom est requis"),
    mail: zod_1.z.string().email("Email invalide"),
    phone: zod_1.z.string().min(6).max(20).optional().nullable(),
    password: zod_1.z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    team: zod_1.z.string().min(1, "L'équipe est requise"),
});
exports.registerSchema = registerSchema;
var loginSchema = zod_1.z.object({
    mail: zod_1.z.string().email("Email invalide"),
    password: zod_1.z.string().min(1, "Le mot de passe est requis"),
});
exports.loginSchema = loginSchema;
