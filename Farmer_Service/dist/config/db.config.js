"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbURI = 'mongodb+srv://wave3jb1:7HLLLshcUZpF2Ij5@cluster0.6nfzb.mongodb.net/Farmers?retryWrites=true&w=majority&appName=Cluster0';
mongoose_1.default
    .connect(dbURI)
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
