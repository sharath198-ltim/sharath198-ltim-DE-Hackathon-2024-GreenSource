"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const AddressSchema = new mongoose_1.Schema({
    id: { type: String, default: uuid_1.v4, unique: true, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
    is_primary: { type: Boolean, default: false }, // Indicates if this is the primary address
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Address', AddressSchema);
