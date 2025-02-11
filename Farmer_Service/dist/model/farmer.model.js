"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const FarmerSchema = new mongoose_1.Schema({
    id: { type: String, default: uuid_1.v4, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    addresses: [{ type: mongoose_1.Types.ObjectId, ref: "Address" }],
    list_products: [{ type: mongoose_1.Types.ObjectId }],
    list_sales: [
        {
            orderId: { type: String },
            amount: { type: Number },
        },
    ],
    is_verified: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Farmer", FarmerSchema);
