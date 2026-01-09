"use strict";
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
exports.start_web_server = start_web_server;
var fastify_1 = require("fastify");
var jwt_1 = require("@fastify/jwt");
var cookie_1 = require("@fastify/cookie");
var connexion_cjs_1 = require("./models/connexion.cjs");
var training_cjs_1 = require("./models/training.cjs");
var zod_1 = require("zod");
var db_cjs_1 = require("./db.cjs");
var crypto = require("node:crypto");
function generateRefreshToken() {
    return crypto.randomBytes(48).toString("hex");
}
function start_web_server() {
    return __awaiter(this, void 0, void 0, function () {
        function formatZodError(err) {
            return err.issues.map(function (issue) { return ({
                path: issue.path.join("."),
                message: issue.message
            }); });
        }
        var web_server, repo, JWT_SECRET, COOKIE_SECRET, isProduction, port;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web_server = (0, fastify_1.default)({ logger: true });
                    repo = new db_cjs_1.Repository();
                    JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
                    COOKIE_SECRET = process.env.COOKIE_SECRET || "dev_cookie_secret_change_me";
                    isProduction = process.env.NODE_ENV === "production";
                    web_server.register(require("@fastify/cors"), {
                        origin: "http://localhost:5173",
                        credentials: true
                    });
                    return [4 /*yield*/, web_server.register(cookie_1.default, {
                            secret: COOKIE_SECRET,
                            hook: "onRequest",
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, web_server.register(jwt_1.default, {
                            secret: JWT_SECRET,
                            cookie: {
                                cookieName: "refresh_token",
                                signed: false,
                            },
                            sign: { expiresIn: "15m" },
                        })];
                case 2:
                    _a.sent();
                    web_server.post("/registercoach", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed, user, accessToken, refreshToken, err_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    parsed = connexion_cjs_1.registerSchema.parse(request.body);
                                    return [4 /*yield*/, repo.registerCoach({
                                            surname: parsed.surname,
                                            name: parsed.name,
                                            mail: parsed.mail,
                                            phone: (_a = parsed.phone) !== null && _a !== void 0 ? _a : null,
                                            password: parsed.password,
                                        })];
                                case 1:
                                    user = _b.sent();
                                    accessToken = web_server.jwt.sign({ id: user.id_coach }, { expiresIn: "15m" });
                                    refreshToken = generateRefreshToken();
                                    return [4 /*yield*/, repo.saveRefreshToken({
                                            userId: user.id_coach,
                                            userType: "coach",
                                            token: refreshToken,
                                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                        })];
                                case 2:
                                    _b.sent();
                                    reply.setCookie("refresh_token", refreshToken, {
                                        httpOnly: true,
                                        secure: isProduction,
                                        sameSite: "strict",
                                        path: "/",
                                        maxAge: 7 * 24 * 60 * 60,
                                    });
                                    return [2 /*return*/, reply.send({ accessToken: accessToken, user: user })];
                                case 3:
                                    err_1 = _b.sent();
                                    return [2 /*return*/, reply.status(400).send({ error: err_1.message })];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.post("/register", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed, user, accessToken, refreshToken, err_2;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 3, , 4]);
                                    parsed = connexion_cjs_1.registerSchema.parse(request.body);
                                    return [4 /*yield*/, repo.registerPlayer({
                                            surname: parsed.surname,
                                            name: parsed.name,
                                            mail: parsed.mail,
                                            phone: (_a = parsed.phone) !== null && _a !== void 0 ? _a : null,
                                            password: parsed.password,
                                        })];
                                case 1:
                                    user = _b.sent();
                                    accessToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "15m" });
                                    refreshToken = generateRefreshToken();
                                    return [4 /*yield*/, repo.saveRefreshToken({
                                            userId: user.id_player,
                                            userType: "player",
                                            token: refreshToken,
                                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                        })];
                                case 2:
                                    _b.sent();
                                    reply.setCookie("refresh_token", refreshToken, {
                                        httpOnly: true,
                                        secure: isProduction,
                                        sameSite: "strict",
                                        path: "/",
                                        maxAge: 7 * 24 * 60 * 60,
                                    });
                                    return [2 /*return*/, reply.send({ accessToken: accessToken, user: user })];
                                case 3:
                                    err_2 = _b.sent();
                                    return [2 /*return*/, reply.status(400).send({ error: err_2.message })];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.post("/login", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed, mail, password, user, accessToken, refreshToken, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    parsed = connexion_cjs_1.loginSchema.parse(request.body);
                                    mail = parsed.mail, password = parsed.password;
                                    return [4 /*yield*/, repo.loginPlayer(mail, password)];
                                case 1:
                                    user = _a.sent();
                                    accessToken = web_server.jwt.sign({ id: user.id_player, userType: "player" }, { expiresIn: "15m" });
                                    refreshToken = generateRefreshToken();
                                    return [4 /*yield*/, repo.saveRefreshToken({
                                            userId: user.id_player,
                                            userType: "player",
                                            token: refreshToken,
                                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                        })];
                                case 2:
                                    _a.sent();
                                    reply.setCookie("refresh_token", refreshToken, {
                                        httpOnly: true,
                                        secure: isProduction,
                                        sameSite: "strict",
                                        path: "/",
                                        maxAge: 7 * 24 * 60 * 60,
                                    });
                                    return [2 /*return*/, reply.send({ accessToken: accessToken, user: user })];
                                case 3:
                                    err_3 = _a.sent();
                                    if (err_3 instanceof zod_1.ZodError) {
                                        return [2 /*return*/, reply.status(400).send({ errors: formatZodError(err_3) })];
                                    }
                                    return [2 /*return*/, reply.status(401).send({ error: err_3.message })];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.post("/logincoach", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed, mail, password, user, accessToken, refreshToken, err_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    parsed = connexion_cjs_1.loginSchema.parse(request.body);
                                    mail = parsed.mail, password = parsed.password;
                                    return [4 /*yield*/, repo.loginCoach(mail, password)];
                                case 1:
                                    user = _a.sent();
                                    accessToken = web_server.jwt.sign({ id: user.id_coach, userType: "coach" }, { expiresIn: "15m" });
                                    refreshToken = generateRefreshToken();
                                    return [4 /*yield*/, repo.saveRefreshToken({
                                            userId: user.id_coach,
                                            userType: "coach", // <--- ajouté
                                            token: refreshToken,
                                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                        })];
                                case 2:
                                    _a.sent();
                                    reply.setCookie("refresh_token", refreshToken, {
                                        httpOnly: true,
                                        secure: isProduction,
                                        sameSite: "strict",
                                        path: "/",
                                        maxAge: 7 * 24 * 60 * 60,
                                    });
                                    return [2 /*return*/, reply.send({ accessToken: accessToken, user: user })];
                                case 3:
                                    err_4 = _a.sent();
                                    if (err_4 instanceof zod_1.ZodError) {
                                        return [2 /*return*/, reply.status(400).send({ errors: formatZodError(err_4) })];
                                    }
                                    return [2 /*return*/, reply.status(400).send({ error: err_4.message })];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.post("/refresh", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var oldRefresh, stored, userId, newRefresh, newAccess;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    oldRefresh = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
                                    if (!oldRefresh)
                                        return [2 /*return*/, reply.status(401).send({ error: "No refresh token" })];
                                    return [4 /*yield*/, repo.findRefreshToken(oldRefresh)];
                                case 1:
                                    stored = _b.sent();
                                    if (!stored || stored.revoked)
                                        return [2 /*return*/, reply.status(401).send({ error: "Refresh token invalid" })];
                                    if (!(new Date(stored.expires_at) < new Date())) return [3 /*break*/, 3];
                                    return [4 /*yield*/, repo.revokeRefreshToken(oldRefresh)];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/, reply.status(401).send({ error: "Expired refresh token" })];
                                case 3: 
                                // Révoque l'ancien token
                                return [4 /*yield*/, repo.revokeRefreshToken(oldRefresh)];
                                case 4:
                                    // Révoque l'ancien token
                                    _b.sent();
                                    userId = stored.userType === "player" ? stored.player_id : stored.coach_id;
                                    newRefresh = generateRefreshToken();
                                    newAccess = web_server.jwt.sign({ id: userId, userType: stored.userType }, { expiresIn: "15m" });
                                    return [4 /*yield*/, repo.saveRefreshToken({
                                            token: newRefresh,
                                            userId: userId,
                                            userType: stored.userType,
                                            revoked: false,
                                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                        })];
                                case 5:
                                    _b.sent();
                                    reply.setCookie("refresh_token", newRefresh, {
                                        httpOnly: true,
                                        secure: isProduction,
                                        sameSite: "strict",
                                        path: "/",
                                    });
                                    return [2 /*return*/, reply.send({ accessToken: newAccess })];
                            }
                        });
                    }); });
                    web_server.post("/logout", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var token;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    token = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
                                    if (!token) return [3 /*break*/, 2];
                                    return [4 /*yield*/, repo.revokeRefreshToken(token)];
                                case 1:
                                    _b.sent();
                                    reply.clearCookie("refresh_token");
                                    _b.label = 2;
                                case 2: return [2 /*return*/, reply.send({ message: "Logged out" })];
                            }
                        });
                    }); });
                    web_server.get("/secret-data", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, request.jwtVerify()];
                                case 1:
                                    _b.sent();
                                    return [2 /*return*/, reply.send({
                                            message: "Accès autorisé",
                                            data: "Voici la fausse donnée secrète",
                                        })];
                                case 2:
                                    _a = _b.sent();
                                    return [2 /*return*/, reply.status(401).send({ error: "Token invalide ou expiré" })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.post("/createtraining", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed, training, err_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    parsed = training_cjs_1.createTrainingSchema.parse(request.body);
                                    return [4 /*yield*/, repo.createTrainingSession(parsed)];
                                case 1:
                                    training = _a.sent();
                                    return [2 /*return*/, reply.send(training)];
                                case 2:
                                    err_5 = _a.sent();
                                    if (err_5 instanceof zod_1.ZodError) {
                                        return [2 /*return*/, reply.status(400).send({ errors: formatZodError(err_5) })];
                                    }
                                    return [2 /*return*/, reply.status(500).send({ error: err_5.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.put("/modifytraining", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var body, training, err_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    body = request.body;
                                    return [4 /*yield*/, repo.modifyTrainingSession(body)];
                                case 1:
                                    training = _a.sent();
                                    return [2 /*return*/, reply.send(training)];
                                case 2:
                                    err_6 = _a.sent();
                                    return [2 /*return*/, reply.status(500).send({ error: err_6.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.delete("/deletetraining/:id_training", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var id_training, training, err_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id_training = Number(request.params.id_training);
                                    return [4 /*yield*/, repo.deleteTrainingSession(id_training)];
                                case 1:
                                    training = _a.sent();
                                    return [2 /*return*/, reply.send(training)];
                                case 2:
                                    err_7 = _a.sent();
                                    return [2 /*return*/, reply.status(500).send({ error: err_7.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.get("/trainings", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var trainings, err_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, repo.listTrainingSessions()];
                                case 1:
                                    trainings = _a.sent();
                                    return [2 /*return*/, reply.send(trainings)];
                                case 2:
                                    err_8 = _a.sent();
                                    return [2 /*return*/, reply.status(500).send({ error: err_8.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.post("/creatematch", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var body, match, err_9;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    body = request.body;
                                    return [4 /*yield*/, repo.createMatchSession(body)];
                                case 1:
                                    match = _a.sent();
                                    return [2 /*return*/, reply.send(match)];
                                case 2:
                                    err_9 = _a.sent();
                                    return [2 /*return*/, reply.status(500).send({ error: err_9.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.put("/modifymatch", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var body, match, err_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    body = request.body;
                                    return [4 /*yield*/, repo.modifyMatchSession(body)];
                                case 1:
                                    match = _a.sent();
                                    return [2 /*return*/, reply.send(match)];
                                case 2:
                                    err_10 = _a.sent();
                                    return [2 /*return*/, reply.status(500).send({ error: err_10.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.delete("/deletematch/:id_match", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var id_match, match, err_11;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id_match = Number(request.params.id_match);
                                    return [4 /*yield*/, repo.deleteMatchSession(id_match)];
                                case 1:
                                    match = _a.sent();
                                    return [2 /*return*/, reply.send(match)];
                                case 2:
                                    err_11 = _a.sent();
                                    return [2 /*return*/, reply.status(500).send({ error: err_11.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.get("/matchs", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var matches, err_12;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, repo.listMatchSessions()];
                                case 1:
                                    matches = _a.sent();
                                    return [2 /*return*/, reply.send(matches)];
                                case 2:
                                    err_12 = _a.sent();
                                    return [2 /*return*/, reply.status(500).send({ error: err_12.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.get("/me", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, id, userType, user, err_13;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 6, , 7]);
                                    return [4 /*yield*/, request.jwtVerify()];
                                case 1:
                                    _b.sent();
                                    _a = request.user, id = _a.id, userType = _a.userType;
                                    user = void 0;
                                    if (!(userType === "player")) return [3 /*break*/, 3];
                                    return [4 /*yield*/, repo.getPlayerById(id)];
                                case 2:
                                    user = _b.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, repo.getCoachById(id)];
                                case 4:
                                    user = _b.sent();
                                    _b.label = 5;
                                case 5: return [2 /*return*/, reply.send({
                                        userType: userType,
                                        user: user,
                                    })];
                                case 6:
                                    err_13 = _b.sent();
                                    return [2 /*return*/, reply.status(401).send({ error: "Unauthorized" })];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); });
                    web_server.get("/subscriptions", function (request, reply) { return __awaiter(_this, void 0, void 0, function () {
                        var subscriptions, err_14;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, repo.getallSubscriptions()];
                                case 1:
                                    subscriptions = _a.sent();
                                    return [2 /*return*/, reply.send(subscriptions)];
                                case 2:
                                    err_14 = _a.sent();
                                    return [2 /*return*/, reply.status(500).send({ error: err_14.message })];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    port = Number(process.env.PORT) || 1234;
                    return [4 /*yield*/, web_server.listen({ port: port, host: "0.0.0.0" })];
                case 3:
                    _a.sent();
                    web_server.log.info("listening on http://0.0.0.0:".concat(port));
                    return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    start_web_server().catch(function (err) {
        console.error(err);
        process.exit(1);
    });
}
