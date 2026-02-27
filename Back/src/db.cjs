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
            var existing, hash, phoneValue, result;
            var surname = _b.surname, name = _b.name, mail = _b.mail, phone = _b.phone, password = _b.password;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    SELECT * FROM player WHERE mail = ", "\n  "], ["\n    SELECT * FROM player WHERE mail = ", "\n  "])), mail)];
                    case 1:
                        existing = _c.sent();
                        if (existing.length > 0) {
                            throw new Error("Un compte existe déjà avec cet email.");
                        }
                        return [4 /*yield*/, argon2.hash(password)];
                    case 2:
                        hash = _c.sent();
                        phoneValue = phone !== null && phone !== void 0 ? phone : null;
                        return [4 /*yield*/, this.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    INSERT INTO player (surname, name, mail, phone, password, status)\n    VALUES (\n      ", ",\n      ", ",\n      ", ",\n      ", ",\n      ", ",\n      'Actif'\n    )\n    RETURNING id_player, surname, name, mail\n  "], ["\n    INSERT INTO player (surname, name, mail, phone, password, status)\n    VALUES (\n      ", ",\n      ", ",\n      ", ",\n      ", ",\n      ", ",\n      'Actif'\n    )\n    RETURNING id_player, surname, name, mail\n  "])), surname, name, mail, phoneValue, hash)];
                    case 3:
                        result = _c.sent();
                        // 5️⃣ Retourner le joueur
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.registerCoach = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var existing, hash, phoneValue, result;
            var surname = _b.surname, name = _b.name, mail = _b.mail, phone = _b.phone, password = _b.password;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT * FROM coach WHERE mail = ", "\n    "], ["\n      SELECT * FROM coach WHERE mail = ", "\n    "])), mail)];
                    case 1:
                        existing = _c.sent();
                        if (existing.length > 0) {
                            throw new Error("Un compte existe déjà avec cet email.");
                        }
                        return [4 /*yield*/, argon2.hash(password)];
                    case 2:
                        hash = _c.sent();
                        phoneValue = phone !== null && phone !== void 0 ? phone : null;
                        return [4 /*yield*/, this.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      INSERT INTO coach (surname, name, mail, phone, password)\n      VALUES (", ", ", ", ", ", ", ", ", ")\n      RETURNING id_coach, surname, name, mail, phone\n    "], ["\n      INSERT INTO coach (surname, name, mail, phone, password)\n      VALUES (", ", ", ", ", ", ", ", ", ")\n      RETURNING id_coach, surname, name, mail, phone\n    "])), surname, name, mail, phoneValue, hash)];
                    case 3:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.loginCoach = function (mail, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, coach, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    SELECT * FROM coach WHERE mail = ", "\n  "], ["\n    SELECT * FROM coach WHERE mail = ", "\n  "])), mail)];
                    case 1:
                        user = _a.sent();
                        if (user.length === 0) {
                            throw new Error("Email ou mot de passe incorrect.");
                        }
                        coach = user[0];
                        return [4 /*yield*/, argon2.verify(coach.password, password)];
                    case 2:
                        isValid = _a.sent();
                        if (!isValid) {
                            throw new Error("Email ou mot de passe incorrect.");
                        }
                        delete coach.password;
                        return [2 /*return*/, coach];
                }
            });
        });
    };
    Repository.prototype.loginPlayer = function (mail, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, player, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    SELECT * FROM player WHERE mail = ", "\n  "], ["\n    SELECT * FROM player WHERE mail = ", "\n  "])), mail)];
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
                        delete player.password;
                        return [2 /*return*/, player];
                }
            });
        });
    };
    Repository.prototype.getPlayerByEmail = function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      SELECT id_player, surname, name, mail, position, number, phone, status\n      FROM player WHERE mail = ", "\n    "], ["\n      SELECT id_player, surname, name, mail, position, number, phone, status\n      FROM player WHERE mail = ", "\n    "])), mail)];
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
                    case 0: return [4 /*yield*/, this.sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      SELECT id_player, surname, name, mail, position, number, phone, status\n      FROM player WHERE id_player = ", "\n    "], ["\n      SELECT id_player, surname, name, mail, position, number, phone, status\n      FROM player WHERE id_player = ", "\n    "])), id_player)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user[0] || null];
                }
            });
        });
    };
    Repository.prototype.getCoachbyEmail = function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n      SELECT id_coach, surname, name, mail, phone\n      FROM coach WHERE mail = ", "\n    "], ["\n      SELECT id_coach, surname, name, mail, phone\n      FROM coach WHERE mail = ", "\n    "])), mail)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user[0] || null];
                }
            });
        });
    };
    Repository.prototype.getCoachById = function (id_coach) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n      SELECT id_coach, surname, name, mail, phone\n      FROM coach WHERE id_coach = ", "\n    "], ["\n      SELECT id_coach, surname, name, mail, phone\n      FROM coach WHERE id_coach = ", "\n    "])), id_coach)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user[0] || null];
                }
            });
        });
    };
    Repository.prototype.saveRefreshToken = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var column, result;
            var userId = _b.userId, userType = _b.userType, token = _b.token, expiresAt = _b.expiresAt;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        column = userType === 'player' ? 'player_id' : 'coach_id';
                        return [4 /*yield*/, this.sql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n    INSERT INTO refresh_tokens (", ", token, expires_at)\n    VALUES (", ", ", ", ", ")\n    RETURNING id, player_id, coach_id, token, expires_at\n  "], ["\n    INSERT INTO refresh_tokens (", ", token, expires_at)\n    VALUES (", ", ", ", ", ")\n    RETURNING id, player_id, coach_id, token, expires_at\n  "])), this.sql(column), userId, token, expiresAt)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.findRefreshToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n    SELECT * FROM refresh_tokens\n    WHERE token = ", "\n    LIMIT 1\n  "], ["\n    SELECT * FROM refresh_tokens\n    WHERE token = ", "\n    LIMIT 1\n  "])), token)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    Repository.prototype.revokeRefreshToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n    UPDATE refresh_tokens\n    SET revoked = TRUE\n    WHERE token = ", "\n  "], ["\n    UPDATE refresh_tokens\n    SET revoked = TRUE\n    WHERE token = ", "\n  "])), token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Repository.prototype.revokeAllUserTokens = function (userId, userType) {
        return __awaiter(this, void 0, void 0, function () {
            var column;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        column = userType === 'player' ? 'player_id' : 'coach_id';
                        return [4 /*yield*/, this.sql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n    UPDATE refresh_tokens\n    SET revoked = TRUE\n    WHERE ", " = ", "\n  "], ["\n    UPDATE refresh_tokens\n    SET revoked = TRUE\n    WHERE ", " = ", "\n  "])), this.sql(column), userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Repository.prototype.createTrainingSession = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var training, players, _i, players_1, player;
            var date = _b.date, hour = _b.hour, location = _b.location, type = _b.type, id_team = _b.id_team, id_coach = _b.id_coach;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n    INSERT INTO training (date, hour, type, location, id_team,id_coach)\n    VALUES (\n      ", ",\n      ", ",\n      ", ",\n      ", ",\n      ", ",\n      ", "\n    )\n    RETURNING id_training\n  "], ["\n    INSERT INTO training (date, hour, type, location, id_team,id_coach)\n    VALUES (\n      ", ",\n      ", ",\n      ", ",\n      ", ",\n      ", ",\n      ", "\n    )\n    RETURNING id_training\n  "])), new Date(date), hour, type, location, id_team, id_coach)];
                    case 1:
                        training = (_c.sent())[0];
                        return [4 /*yield*/, this.sql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n    SELECT id_player\n    FROM player\n    WHERE id_team = ", " AND status = 'Actif'\n  "], ["\n    SELECT id_player\n    FROM player\n    WHERE id_team = ", " AND status = 'Actif'\n  "])), id_team)];
                    case 2:
                        players = _c.sent();
                        _i = 0, players_1 = players;
                        _c.label = 3;
                    case 3:
                        if (!(_i < players_1.length)) return [3 /*break*/, 6];
                        player = players_1[_i];
                        return [4 /*yield*/, this.sql(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n      INSERT INTO convocation (id_player, id_training, status)\n      VALUES (", ", ", ", 'Waiting')\n    "], ["\n      INSERT INTO convocation (id_player, id_training, status)\n      VALUES (", ", ", ", 'Waiting')\n    "])), player.id_player, training.id_training)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, training];
                }
            });
        });
    };
    Repository.prototype.getTrainingById = function (id_training) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n      SELECT * FROM training WHERE id_training = ", "\n    "], ["\n      SELECT * FROM training WHERE id_training = ", "\n    "])), id_training)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    Repository.prototype.getConvocationsTrainingbyplayer = function (id_player) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n    SELECT\n  c.id_convocation,\n  c.status,\n  t.date,\n  t.hour,\n  t.type,\n  t.location,\n  tm.name AS team_name\nFROM convocation c\nJOIN training t ON c.id_training = t.id_training\nJOIN team tm ON t.id_team = tm.id_team\nWHERE c.id_player = ", "\nORDER BY t.date DESC, tm.name;\n  "], ["\n    SELECT\n  c.id_convocation,\n  c.status,\n  t.date,\n  t.hour,\n  t.type,\n  t.location,\n  tm.name AS team_name\nFROM convocation c\nJOIN training t ON c.id_training = t.id_training\nJOIN team tm ON t.id_team = tm.id_team\nWHERE c.id_player = ", "\nORDER BY t.date DESC, tm.name;\n  "])), id_player)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.getConvocationsMatchbyplayer = function (id_player) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\n    SELECT\n  c.id_convocation,\n  c.status,\n  m.date,\n  m.hour,\n  m.type,\n  m.location,\n  tm.name AS team_name,\n  m.opponent\nFROM convocation c\nJOIN matches m ON c.id_match = m.id_match \nJOIN team tm ON m.id_team = tm.id_team\nWHERE c.id_player = ", "\nORDER BY m.date DESC, tm.name;\n  "], ["\n    SELECT\n  c.id_convocation,\n  c.status,\n  m.date,\n  m.hour,\n  m.type,\n  m.location,\n  tm.name AS team_name,\n  m.opponent\nFROM convocation c\nJOIN matches m ON c.id_match = m.id_match \nJOIN team tm ON m.id_team = tm.id_team\nWHERE c.id_player = ", "\nORDER BY m.date DESC, tm.name;\n  "])), id_player)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.getConvocationsByTraining = function (id_training) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\n    SELECT c.*, p.name AS player_name, p.surname AS player_surname\n    FROM convocation c\n    JOIN player p ON c.id_player = p.id_player\n    WHERE c.id_training = ", "\n  "], ["\n    SELECT c.*, p.name AS player_name, p.surname AS player_surname\n    FROM convocation c\n    JOIN player p ON c.id_player = p.id_player\n    WHERE c.id_training = ", "\n  "])), id_training)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.getConvocationsByMatch = function (id_match) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_22 || (templateObject_22 = __makeTemplateObject(["\n    SELECT c.*, p.name AS player_name, p.surname AS player_surname\n    FROM convocation c\n    JOIN player p ON c.id_player = p.id_player\n    WHERE c.id_match = ", "\n  "], ["\n    SELECT c.*, p.name AS player_name, p.surname AS player_surname\n    FROM convocation c\n    JOIN player p ON c.id_player = p.id_player\n    WHERE c.id_match = ", "\n  "])), id_match)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.modifyTrainingSession = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result;
            var id_training = _b.id_training, date = _b.date, hour = _b.hour, location = _b.location, type = _b.type, id_team = _b.id_team, id_coach = _b.id_coach;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_23 || (templateObject_23 = __makeTemplateObject(["\n    UPDATE training\n    SET date = ", ", hour = ", ", type = ", ", location = ", ", id_team = ", ", id_coach = ", "\n    WHERE id_training = ", "\n    RETURNING id_training\n  "], ["\n    UPDATE training\n    SET date = ", ", hour = ", ", type = ", ", location = ", ", id_team = ", ", id_coach = ", "\n    WHERE id_training = ", "\n    RETURNING id_training\n  "])), date, hour, type, location, id_team, id_coach, id_training)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.deleteTrainingSession = function (id_training) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_24 || (templateObject_24 = __makeTemplateObject(["\n      DELETE FROM training\n      WHERE id_training = ", "\n\n      DELETE FROM convocation\n      WHERE id_training = ", "\n    "], ["\n      DELETE FROM training\n      WHERE id_training = ", "\n\n      DELETE FROM convocation\n      WHERE id_training = ", "\n    "])), id_training, id_training)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.getAllTrainings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_25 || (templateObject_25 = __makeTemplateObject(["\n    SELECT\n      tr.id_training,\n      tr.date,\n      tr.hour,\n      tr.type,\n      tr.location,\n      t.name AS team_name,\n      tr.id_team,\n      tr.id_coach\n    FROM training tr\n    LEFT JOIN team t ON tr.id_team = t.id_team\n    ORDER BY tr.date DESC, t.name;\n  "], ["\n    SELECT\n      tr.id_training,\n      tr.date,\n      tr.hour,\n      tr.type,\n      tr.location,\n      t.name AS team_name,\n      tr.id_team,\n      tr.id_coach\n    FROM training tr\n    LEFT JOIN team t ON tr.id_team = t.id_team\n    ORDER BY tr.date DESC, t.name;\n  "])))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.createMatchSession = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var match, players, _i, players_2, player;
            var date = _b.date, hour = _b.hour, opponent = _b.opponent, location = _b.location, type = _b.type, id_team = _b.id_team, id_coach = _b.id_coach, _c = _b.score_home, score_home = _c === void 0 ? null : _c, _d = _b.score_outside, score_outside = _d === void 0 ? null : _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_26 || (templateObject_26 = __makeTemplateObject(["\n    INSERT INTO matches (\n      date, hour, opponent, location, type,\n      id_team,id_coach, score_home, score_outside\n    )\n    VALUES (\n      ", ", ", ", ", ", ", ", ", ",\n      ", ",", ", ", ", ", "\n    )\n    RETURNING id_match\n  "], ["\n    INSERT INTO matches (\n      date, hour, opponent, location, type,\n      id_team,id_coach, score_home, score_outside\n    )\n    VALUES (\n      ", ", ", ", ", ", ", ", ", ",\n      ", ",", ", ", ", ", "\n    )\n    RETURNING id_match\n  "])), date, hour, opponent, location, type, id_team, id_coach, score_home, score_outside)];
                    case 1:
                        match = (_e.sent())[0];
                        return [4 /*yield*/, this.sql(templateObject_27 || (templateObject_27 = __makeTemplateObject(["\n    SELECT id_player\n    FROM player\n    WHERE id_team = ", " AND status = 'Actif'\n  "], ["\n    SELECT id_player\n    FROM player\n    WHERE id_team = ", " AND status = 'Actif'\n  "])), id_team)];
                    case 2:
                        players = _e.sent();
                        _i = 0, players_2 = players;
                        _e.label = 3;
                    case 3:
                        if (!(_i < players_2.length)) return [3 /*break*/, 6];
                        player = players_2[_i];
                        return [4 /*yield*/, this.sql(templateObject_28 || (templateObject_28 = __makeTemplateObject(["\n      INSERT INTO convocation (id_player, id_match, status)\n      VALUES (", ", ", ", 'Waiting')\n    "], ["\n      INSERT INTO convocation (id_player, id_match, status)\n      VALUES (", ", ", ", 'Waiting')\n    "])), player.id_player, match.id_match)];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, match];
                }
            });
        });
    };
    Repository.prototype.modifyMatchSession = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result;
            var id_match = _b.id_match, date = _b.date, hour = _b.hour, opponent = _b.opponent, location = _b.location, type = _b.type, team = _b.team, score_home = _b.score_home, score_outside = _b.score_outside;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_29 || (templateObject_29 = __makeTemplateObject(["\n    UPDATE matches\n    SET date = ", ", hour = ", ", opponent = ", ", location = ", ", type = ", ", team = ", ", score_home = ", ", score_outside = ", "\n    WHERE id_match = ", "\n    RETURNING id_match\n  "], ["\n    UPDATE matches\n    SET date = ", ", hour = ", ", opponent = ", ", location = ", ", type = ", ", team = ", ", score_home = ", ", score_outside = ", "\n    WHERE id_match = ", "\n    RETURNING id_match\n  "])), date, hour, opponent, location, type, team, score_home, score_outside, id_match)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.deleteMatchSession = function (id_match) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_30 || (templateObject_30 = __makeTemplateObject(["\n      DELETE FROM matches\n      WHERE id_match = ", "\n\n      DELETE FROM convocation\n      WHERE id_match = ", "\n    "], ["\n      DELETE FROM matches\n      WHERE id_match = ", "\n\n      DELETE FROM convocation\n      WHERE id_match = ", "\n    "])), id_match, id_match)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.listMatchSessions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_31 || (templateObject_31 = __makeTemplateObject(["\n      SELECT * FROM matches NATURAL JOIN team\n    "], ["\n      SELECT * FROM matches NATURAL JOIN team\n    "])))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.updateMatchScore = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result;
            var id_match = _b.id_match, score_home = _b.score_home, score_outside = _b.score_outside;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_32 || (templateObject_32 = __makeTemplateObject(["\n    UPDATE matches\n    SET score_home = ", ",\n        score_outside = ", "\n    WHERE id_match = ", "\n    RETURNING *\n  "], ["\n    UPDATE matches\n    SET score_home = ", ",\n        score_outside = ", "\n    WHERE id_match = ", "\n    RETURNING *\n  "])), score_home, score_outside, id_match)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.createTeam = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result;
            var name = _b.name, category = _b.category, season = _b.season;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_33 || (templateObject_33 = __makeTemplateObject(["\n    INSERT INTO team (name, category, season)\n    VALUES (", ", ", ", ", ")\n    RETURNING id_team\n  "], ["\n    INSERT INTO team (name, category, season)\n    VALUES (", ", ", ", ", ")\n    RETURNING id_team\n  "])), name, category, season)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.listTeams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_34 || (templateObject_34 = __makeTemplateObject(["\n      SELECT * FROM team\n    "], ["\n      SELECT * FROM team\n    "])))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.modifyTeam = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result;
            var id_team = _b.id_team, name = _b.name, category = _b.category, season = _b.season;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_35 || (templateObject_35 = __makeTemplateObject(["\n    UPDATE team\n    SET name = ", ", category = ", ", season = ", "\n    WHERE id_team = ", "\n    RETURNING id_team\n  "], ["\n    UPDATE team\n    SET name = ", ", category = ", ", season = ", "\n    WHERE id_team = ", "\n    RETURNING id_team\n  "])), name, category, season, id_team)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.deleteTeam = function (id_team) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_36 || (templateObject_36 = __makeTemplateObject(["\n      DELETE FROM team\n      WHERE id_team = ", "\n    "], ["\n      DELETE FROM team\n      WHERE id_team = ", "\n    "])), id_team)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Repository.prototype.getallPlayers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_37 || (templateObject_37 = __makeTemplateObject(["\n            SELECT\n          p.id_player,\n          p.name,\n          p.surname,\n          p.position,\n          p.number,\n          p.status,\n          t.name AS team_name\n      FROM player p\n      LEFT JOIN team t ON p.id_team = t.id_team\n      ORDER BY t.name, p.surname;\n          "], ["\n            SELECT\n          p.id_player,\n          p.name,\n          p.surname,\n          p.position,\n          p.number,\n          p.status,\n          t.name AS team_name\n      FROM player p\n      LEFT JOIN team t ON p.id_team = t.id_team\n      ORDER BY t.name, p.surname;\n          "])))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.getplayerbyid = function (id_player) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_38 || (templateObject_38 = __makeTemplateObject(["\n      SELECT id_player, surname, name, mail, position, number, phone, status,id_team\n      FROM player WHERE id_player = ", "\n    "], ["\n      SELECT id_player, surname, name, mail, position, number, phone, status,id_team\n      FROM player WHERE id_player = ", "\n    "])), id_player)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    Repository.prototype.updatePlayer = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result;
            var id_player = _b.id_player, surname = _b.surname, name = _b.name, position = _b.position, number = _b.number, status = _b.status, id_team = _b.id_team;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_39 || (templateObject_39 = __makeTemplateObject(["\n    UPDATE player\n    SET\n      surname = ", ",\n      name = ", ",\n      position = ", ",\n      number = ", ",\n      status = ", ",\n      id_team = ", "\n    WHERE id_player = ", "\n    RETURNING id_player\n  "], ["\n    UPDATE player\n    SET\n      surname = ", ",\n      name = ", ",\n      position = ", ",\n      number = ", ",\n      status = ", ",\n      id_team = ", "\n    WHERE id_player = ", "\n    RETURNING id_player\n  "])), surname, name, position, number, status, id_team, id_player)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.getprofileplayer = function (id_player) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_40 || (templateObject_40 = __makeTemplateObject(["\n      SELECT p.id_player, p.surname, p.name, p.mail, p.position, p.number, p.phone, p.status,team.name AS team_name\n      FROM player AS p JOIN team ON p.id_team = team.id_team WHERE id_player = ", "\n    "], ["\n      SELECT p.id_player, p.surname, p.name, p.mail, p.position, p.number, p.phone, p.status,team.name AS team_name\n      FROM player AS p JOIN team ON p.id_team = team.id_team WHERE id_player = ", "\n    "])), id_player)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    Repository.prototype.addSubscription = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var result;
            var id_player = _b.id_player, total = _b.total, status = _b.status, payment_date = _b.payment_date;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_41 || (templateObject_41 = __makeTemplateObject(["\n    INSERT INTO subscription (id_player, total, status, payment_date)\n    VALUES (", ", ", ", ", ", ", ")\n    RETURNING id_subscription\n  "], ["\n    INSERT INTO subscription (id_player, total, status, payment_date)\n    VALUES (", ", ", ", ", ", ", ")\n    RETURNING id_subscription\n  "])), id_player, total, status, payment_date)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.getallSubscriptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_42 || (templateObject_42 = __makeTemplateObject(["\n      SELECT\n        s.id_subscription AS id,\n        s.id_player,\n        s.total,\n        s.status,\n        s.payment_date,\n        p.name AS player_name,\n        p.surname AS player_surname\n      FROM subscription s\n      JOIN player p ON p.id_player = s.id_player\n      ORDER BY s.id_subscription DESC\n    "], ["\n      SELECT\n        s.id_subscription AS id,\n        s.id_player,\n        s.total,\n        s.status,\n        s.payment_date,\n        p.name AS player_name,\n        p.surname AS player_surname\n      FROM subscription s\n      JOIN player p ON p.id_player = s.id_player\n      ORDER BY s.id_subscription DESC\n    "])))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(function (r) { return ({
                                id: r.id,
                                id_player: r.id_player,
                                total_amount: r.total !== null ? Number(r.total) : 0,
                                status: r.status,
                                payment_date: r.payment_date,
                                player: {
                                    name: r.player_name,
                                    surname: r.player_surname,
                                },
                            }); })];
                }
            });
        });
    };
    Repository.prototype.subscriptionteam = function (id_team) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_43 || (templateObject_43 = __makeTemplateObject(["\n      SELECT\n      count(*) AS total_players,\n      count(CASE WHEN s.status = 'Paid' THEN 1 END) AS paid_players,\n      count(CASE WHEN s.status = 'Late' THEN 1 END) AS late_players,\n      count(CASE WHEN s.status = 'Not paid' THEN 1 END) AS unpaid_players\n      FROM subscription s\n      JOIN player p ON p.id_player = s.id_player\n      WHERE p.id_team = ", "\n    "], ["\n      SELECT\n      count(*) AS total_players,\n      count(CASE WHEN s.status = 'Paid' THEN 1 END) AS paid_players,\n      count(CASE WHEN s.status = 'Late' THEN 1 END) AS late_players,\n      count(CASE WHEN s.status = 'Not paid' THEN 1 END) AS unpaid_players\n      FROM subscription s\n      JOIN player p ON p.id_player = s.id_player\n      WHERE p.id_team = ", "\n    "])), id_team)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.getsubscriptionbyplayer = function (id_player) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_44 || (templateObject_44 = __makeTemplateObject(["\n      SELECT id_subscription, total, status, payment_date\n      FROM subscription WHERE id_player = ", "\n    "], ["\n      SELECT id_subscription, total, status, payment_date\n      FROM subscription WHERE id_player = ", "\n    "])), id_player)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    Repository.prototype.getplayerwithnosubscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_45 || (templateObject_45 = __makeTemplateObject(["\n      SELECT id_player, surname, name, mail, position, number, phone, status,id_team\n      FROM player WHERE id_player NOT IN (SELECT id_player FROM subscription)\n    "], ["\n      SELECT id_player, surname, name, mail, position, number, phone, status,id_team\n      FROM player WHERE id_player NOT IN (SELECT id_player FROM subscription)\n    "])))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Repository.prototype.getstatisticsteam = function (id_team) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_46 || (templateObject_46 = __makeTemplateObject(["\n      SELECT\n      COUNT(*) AS total_players,\n      COUNT(CASE WHEN goals > 0 THEN 1 END) AS players_with_goals,\n      COUNT(CASE WHEN passes > 0 THEN 1 END) AS players_with_passes,\n      COUNT(CASE WHEN yellow_cards > 0 THEN 1 END) AS players_with_yellow_cards,\n      COUNT(CASE WHEN red_cards > 0 THEN 1 END) AS players_with_red_cards\n      FROM statistics s\n      JOIN player p ON p.id_player = s.id_player\n      WHERE id_team = ", "\n    "], ["\n      SELECT\n      COUNT(*) AS total_players,\n      COUNT(CASE WHEN goals > 0 THEN 1 END) AS players_with_goals,\n      COUNT(CASE WHEN passes > 0 THEN 1 END) AS players_with_passes,\n      COUNT(CASE WHEN yellow_cards > 0 THEN 1 END) AS players_with_yellow_cards,\n      COUNT(CASE WHEN red_cards > 0 THEN 1 END) AS players_with_red_cards\n      FROM statistics s\n      JOIN player p ON p.id_player = s.id_player\n      WHERE id_team = ", "\n    "])), id_team)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    Repository.prototype.statisticsplayer = function (id_player) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_47 || (templateObject_47 = __makeTemplateObject(["\n      SELECT goals, passes, yellow_cards, red_cards\n      FROM statistics\n      WHERE id_player = ", "\n    "], ["\n      SELECT goals, passes, yellow_cards, red_cards\n      FROM statistics\n      WHERE id_player = ", "\n    "])), id_player)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    Repository.prototype.nextMatch = function (id_team) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_48 || (templateObject_48 = __makeTemplateObject(["\n      SELECT *\n      FROM matches\n      WHERE id_team = ", " AND date >= CURRENT_DATE\n      ORDER BY date ASC\n      LIMIT 1\n    "], ["\n      SELECT *\n      FROM matches\n      WHERE id_team = ", " AND date >= CURRENT_DATE\n      ORDER BY date ASC\n      LIMIT 1\n    "])), id_team)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    Repository.prototype.nextTraining = function (id_team) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sql(templateObject_49 || (templateObject_49 = __makeTemplateObject(["\n      SELECT *\n      FROM training\n      WHERE id_team = ", " AND date >= CURRENT_DATE\n      ORDER BY date ASC\n      LIMIT 1\n    "], ["\n      SELECT *\n      FROM training\n      WHERE id_team = ", " AND date >= CURRENT_DATE\n      ORDER BY date ASC\n      LIMIT 1\n    "])), id_team)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    return Repository;
}());
exports.Repository = Repository;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45, templateObject_46, templateObject_47, templateObject_48, templateObject_49;
