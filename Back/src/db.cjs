"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
var postgres = require("postgres");
var argon2 = require("argon2");
process.loadEnvFile();
var sql = postgres({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || "toto",
    password: process.env.PGPASSWORD || "example",
    database: process.env.PGDATABASE || "projet_club_db",
});
var Repository = /** @class */ (function () {
    function Repository() {
        this.sql = sql;
    }
    Repository.prototype.registerPlayer = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var existing, hash, result;
            var surname = _b.surname, name = _b.name, mail = _b.mail, phone = _b.phone, password = _b.password;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT * FROM player WHERE mail = ", "\n    "], ["\n      SELECT * FROM player WHERE mail = ", "\n    "])), mail)];
                    case 1:
                        existing = _c.sent();
                        if (existing.length > 0) {
                            throw new Error("Un compte existe déjà avec cet email.");
                        }
                        return [4 /*yield*/, argon2.hash(password)];
                    case 2:
                        hash = _c.sent();
                        return [4 /*yield*/, this.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      INSERT INTO player (surname, name, mail, phone, password, status)\n      VALUES (", ", ", ", ", ", ", ", ", ", 'Actif')\n      RETURNING id_player, surname, name, mail\n    "], ["\n      INSERT INTO player (surname, name, mail, phone, password, status)\n      VALUES (", ", ", ", ", ", ", ", ", ", 'Actif')\n      RETURNING id_player, surname, name, mail\n    "])), surname, name, mail, phone, hash)];
                    case 3:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.loginPlayer = function (mail, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, player, isValid, _, safeUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT * FROM player WHERE mail = ", "\n    "], ["\n      SELECT * FROM player WHERE mail = ", "\n    "])), mail)];
                    case 1:
                        user = _a.sent();
                        if (user.length === 0) {
                            throw new Error("Email ou mot de passe incorrect.");
                        }
                        player = user[0];
                        return [4 /*yield*/, argon2.verify(player.password, password)];
                    case 2:
                        isValid = _a.sent();
                        if (!isValid) {
                            throw new Error("Email ou mot de passe incorrect.");
                        }
                        _ = player.mot_de_passe, safeUser = __rest(player, ["mot_de_passe"]);
                        return [2 /*return*/, safeUser];
                }
            });
        });
    };
    Repository.prototype.getPlayerByEmail = function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      SELECT id_player, surname, name, mail, position, number, phone, status\n      FROM player WHERE mail = ", "\n    "], ["\n      SELECT id_player, surname, name, mail, position, number, phone, status\n      FROM player WHERE mail = ", "\n    "])), mail)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user[0] || null];
                }
            });
        });
    };
    Repository.prototype.getPlayerById = function (id_player) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      SELECT id_playr, surname, name, mail, position, number, phone, status\n      FROM player WHERE id_player = ", "\n    "], ["\n      SELECT id_playr, surname, name, mail, position, number, phone, status\n      FROM player WHERE id_player = ", "\n    "])), id_player)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user[0] || null];
                }
            });
        });
    };
    return Repository;
}());
exports.Repository = Repository;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
