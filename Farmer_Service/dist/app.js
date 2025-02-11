"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const farmer_route_1 = __importDefault(require("./routes/farmer.route"));
require("./config/db.config"); // Connect to MongoDB
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:", "http://localhost:3801", "http://localhost:3802"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
})); // Enable CORS
app.use(express_1.default.json());
app.use('/api', farmer_route_1.default);
exports.default = app;
