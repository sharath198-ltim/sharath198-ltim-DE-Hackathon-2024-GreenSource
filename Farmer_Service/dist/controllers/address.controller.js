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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateAddressWithFarmer = exports.deleteAddress = exports.updateAddress = exports.getAddress = exports.getAddresses = exports.createAddress = void 0;
const address_model_1 = __importDefault(require("../model/address.model"));
const farmer_model_1 = __importDefault(require("../model/farmer.model"));
// Create a new address
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressData = req.body; // Get address data from request body
        const newAddress = new address_model_1.default(addressData);
        yield newAddress.save();
        res.status(201).json(newAddress);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error creating address:', error.message);
            res.status(500).json({ message: 'Error creating address', error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.createAddress = createAddress;
// Get all addresses
const getAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addresses = yield address_model_1.default.find();
        res.json(addresses);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching addresses:', error.message);
            res.status(500).json({ message: 'Error fetching addresses', error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.getAddresses = getAddresses;
// Get a single address by ID
const getAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield address_model_1.default.findById(req.params.id);
        if (!address) {
            res.status(404).json({ message: 'Address not found' });
        }
        res.json(address);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching address:', error.message);
            res.status(500).json({ message: 'Error fetching address', error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.getAddress = getAddress;
// Update an address
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedAddress = yield address_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAddress) {
            res.status(404).json({ message: 'Address not found' });
        }
        res.json(updatedAddress);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error updating address:', error.message);
            res.status(500).json({ message: 'Error updating address', error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.updateAddress = updateAddress;
// Delete an address
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedAddress = yield address_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            res.status(404).json({ message: 'Address not found' });
        }
        res.json({ message: 'Address deleted' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting address:', error.message);
            res.status(500).json({ message: 'Error deleting address', error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.deleteAddress = deleteAddress;
// Associate an address with a Farmer
const associateAddressWithFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farmerId } = req.params; // Get Farmer ID from request parameters
        const addressData = req.body; // Get address data from request body
        // Create a new address
        const newAddress = new address_model_1.default(addressData);
        yield newAddress.save(); // Save the address to the database
        // Update the Farmer to include the new address ID
        yield farmer_model_1.default.findByIdAndUpdate(farmerId, { $push: { addresses: newAddress._id } }, { new: true });
        res.status(201).json(newAddress); // Respond with the created address
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error associating address with Farmer:', error.message);
            res.status(500).json({ message: 'Error associating address with Farmer', error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.associateAddressWithFarmer = associateAddressWithFarmer;
