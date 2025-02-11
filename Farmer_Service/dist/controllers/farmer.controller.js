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
exports.loginFarmer = exports.updateFarmerRole = exports.updateFarmerVerifiedStatus = exports.addOrder = exports.getOrders = exports.updateFarmerAddress = exports.updateFarmerEmail = exports.updateFarmerPhone = exports.getEarnings = exports.updateFarmerName = exports.deleteFarmerAddress = exports.addFarmerAddress = exports.deleteProduct = exports.getProducts = exports.addProduct = exports.deleteFarmer = exports.updateFarmer = exports.getFarmerAddress = exports.getFarmer = exports.getFarmers = exports.createFarmer = void 0;
const farmer_model_1 = __importDefault(require("../model/farmer.model"));
const address_model_1 = __importDefault(require("../model/address.model"));
const axios_1 = __importDefault(require("axios"));
// Create a new Farmer
const createFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Create addresses
        const addressData = req.body.addresses; // Assuming addresses data is in req.body.addresses
        const addressDocs = yield address_model_1.default.insertMany(addressData);
        const addressIds = addressDocs.map((address) => address._id); // Get address IDs
        // Step 2: Create Farmer with address IDs
        const farmerData = Object.assign(Object.assign({}, req.body), { addresses: addressIds });
        const farmer = new farmer_model_1.default(farmerData);
        yield farmer.save();
        res.status(201).json(farmer);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error creating Farmer:", error.message); // Log the error message
            res
                .status(500)
                .json({ message: "Error creating Farmer", error: error.message });
        }
        else {
            // Fallback if error is not of type Error
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.createFarmer = createFarmer;
// Get all Farmers
const getFarmers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmers = yield farmer_model_1.default.find();
        res.json(farmers);
        console.log("Farmer details fetched successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching Farmer:", error.message); // Log the error message
            res
                .status(500)
                .json({ message: "Error fetching Farmer", error: error.message });
        }
        else {
            // Fallback if error is not of type Error
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.getFarmers = getFarmers;
// Get a single Farmer
const getFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmer = yield farmer_model_1.default.findOne({ email: req.params.email });
        res.json(farmer);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching Farmer:", error.message); // Log the error message
            res
                .status(500)
                .json({ message: "Error fetching Farmer", error: error.message });
        }
        else {
            // Fallback if error is not of type Error
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.getFarmer = getFarmer;
// get farmer address by email
const getFarmerAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const farmer = yield farmer_model_1.default.findOne({ email: req.params.email });
    const addresses = yield address_model_1.default.find({ _id: { $in: farmer === null || farmer === void 0 ? void 0 : farmer.addresses } });
    res.json(addresses);
});
exports.getFarmerAddress = getFarmerAddress;
// Update a Farmer
const updateFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmer = yield farmer_model_1.default.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
        res.json(farmer);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error updating Farmer:", error.message); // Log the error message
            res
                .status(500)
                .json({ message: "Error updating Farmer", error: error.message });
        }
        else {
            // Fallback if error is not of type Error
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.updateFarmer = updateFarmer;
// Delete a Farmer
const deleteFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield farmer_model_1.default.findOneAndDelete({ email: req.params.email });
        res.json({ message: "Farmer deleted" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error deleting Farmer:", error.message); // Log the error message
            res
                .status(500)
                .json({ message: "Error deleting Farmer", error: error.message });
        }
        else {
            // Fallback if error is not of type Error
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.deleteFarmer = deleteFarmer;
// Add Product - communicates with product service
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = req.body; // Get product data from request body
        const farmerId = req.params.email; // Get farmer ID from request parameters
        // Include the farmer ID in the product data
        const farmer = yield farmer_model_1.default.findOne({ email: farmerId });
        const farmerName = farmer
            ? `${farmer.first_name} ${farmer.last_name}`
            : null;
        productData.farmerId = farmerId;
        productData.farmerName = farmerName;
        // Send POST request to product service
        const response = yield axios_1.default.post("http://localhost:3807/", productData);
        // Update the Farmer's list_products with the new product ID
        const productId = response.data._id; // Assuming the product ID is returned in the response
        yield farmer_model_1.default.findOneAndUpdate({ email: farmerId }, { $push: { list_products: productId } });
        res.status(201).json(response.data);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error communicating with product service:", error.message);
            res.status(500).json({
                message: "Error communicating with product service",
                error: error.message,
            });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.addProduct = addProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get Farmer ID from request parameters
        // Find the farmer and retrieve their product IDs
        const farmer = yield farmer_model_1.default.findOne({ email: req.params.email });
        if (!farmer) {
            res.status(404).json({ message: "Farmer not found" });
            return;
        }
        const productIds = farmer.list_products; // Assuming this contains the product IDs
        const products = [];
        // Fetch products one by one
        for (const productId of productIds) {
            const response = yield axios_1.default.get(`http://localhost:3807/${productId}`);
            products.push(response.data); // Collect product data
        }
        res.json(products); // Return the fetched product data
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products", error: error });
    }
});
exports.getProducts = getProducts;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, productId } = req.params;
        // Send DELETE request to product service
        yield axios_1.default.delete(`http://localhost:3807/${productId}`);
        // Remove product ID from the farmer's list_products
        yield farmer_model_1.default.findOneAndUpdate({ email: email }, { $pull: { list_products: productId } });
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error communicating with product service:", error.message);
            res.status(500).json({
                message: "Error communicating with product service",
                error: error.message,
            });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.deleteProduct = deleteProduct;
const addFarmerAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.email; // Get Farmer ID from request parameters
        const addressData = req.body; // Get address data from request body
        // Create a new address
        const newAddress = new address_model_1.default(addressData);
        yield newAddress.save(); // Save the address to the database
        // Update the Farmer to include the new address ID
        yield farmer_model_1.default.findOneAndUpdate({ email: id }, { $push: { addresses: newAddress._id } }, { new: true });
        res.status(201).json(newAddress); // Respond with the created address
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error adding Farmer address:", error.message);
            res
                .status(500)
                .json({ message: "Error adding Farmer address", error: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.addFarmerAddress = addFarmerAddress;
// Delete a farmer's address
const deleteFarmerAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, addressId } = req.params;
        // Remove address ID from farmer's addresses array
        yield farmer_model_1.default.findOneAndUpdate({ email: email }, { $pull: { addresses: addressId } });
        // Delete the address from Address collection
        yield address_model_1.default.findByIdAndDelete(addressId);
        res.status(200).json({ message: "Address deleted successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error deleting farmer address:", error.message);
            res.status(500).json({
                message: "Error deleting farmer address",
                error: error.message,
            });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.deleteFarmerAddress = deleteFarmerAddress;
// Update Farmer name
const updateFarmerName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmer = yield farmer_model_1.default.findOneAndUpdate({ email: req.params.email }, { first_name: req.body.firstName, last_name: req.body.lastName }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: "Farmer not found" });
        }
        res.json(farmer_model_1.default);
    }
    catch (error) {
        console.error("Error updating Farmer name:", error);
        res.status(500).json({
            message: "Error updating Farmer name",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});
exports.updateFarmerName = updateFarmerName;
const getEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`http://localhost:3808/api/orders/${req.params.email}/farmers`);
    try {
        const orders = response.data;
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const earnings = {
            today: 0,
            week: 0,
            month: 0,
            allTime: 0,
        };
        orders.forEach((order) => {
            // Only calculate earnings for delivered orders
            if (order.status === "DELIVERED") {
                const orderDate = new Date(order.createdAt);
                const amount = order.totalAmount;
                // Add to all time earnings
                earnings.allTime += amount;
                // Check if order is from today
                if (orderDate >= startOfToday) {
                    earnings.today += amount;
                }
                // Check if order is from this week
                if (orderDate >= startOfWeek) {
                    earnings.week += amount;
                }
                // Check if order is from this month
                if (orderDate >= startOfMonth) {
                    earnings.month += amount;
                }
            }
        });
        res.json(earnings);
    }
    catch (error) {
        console.error("Error calculating earnings:", error);
        res.status(500).json({
            message: "Error calculating earnings",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});
exports.getEarnings = getEarnings;
// Update Farmer phone
const updateFarmerPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmer = yield farmer_model_1.default.findOneAndUpdate({ email: req.params.email }, { phone: req.body.phone }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: "Farmer not found" });
        }
        res.json(farmer_model_1.default);
    }
    catch (error) {
        console.error("Error updating Farmer phone:", error);
        res.status(500).json({
            message: "Error updating Farmer phone",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});
exports.updateFarmerPhone = updateFarmerPhone;
// Update Farmer email
const updateFarmerEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmer = yield farmer_model_1.default.findOneAndUpdate({ email: req.params.email }, { email: req.body.email }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: "Farmer not found" });
        }
        res.json(farmer_model_1.default);
    }
    catch (error) {
        console.error("Error updating Farmer email:", error);
        res.status(500).json({
            message: "Error updating Farmer email",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});
exports.updateFarmerEmail = updateFarmerEmail;
// Update Farmer address by ID
const updateFarmerAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedAddress = yield address_model_1.default.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
        if (!updatedAddress) {
            res.status(404).json({ message: "Address not found" });
        }
        res.json(updatedAddress);
    }
    catch (error) {
        console.error("Error updating Farmer address:", error);
        res.status(500).json({
            message: "Error updating Farmer address",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});
exports.updateFarmerAddress = updateFarmerAddress;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield farmer_model_1.default.find({ farmerEmail: req.params.email });
    res.json(orders);
});
exports.getOrders = getOrders;
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield farmer_model_1.default.findOneAndUpdate({ email: req.params.email }, {
        $push: {
            list_sales: {
                orderId: req.body.orderId,
                amount: req.body.amount,
            },
        },
    }, { new: true });
    res.json(order);
});
exports.addOrder = addOrder;
// Update Farmer verified status
const updateFarmerVerifiedStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmer = yield farmer_model_1.default.findOneAndUpdate({ email: req.params.email }, { is_verified: req.body.is_verified }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: "Farmer not found" });
        }
        res.json(farmer_model_1.default);
    }
    catch (error) {
        console.error("Error updating Farmer verified status:", error);
        res.status(500).json({
            message: "Error updating Farmer verified status",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});
exports.updateFarmerVerifiedStatus = updateFarmerVerifiedStatus;
// Update Farmer role
const updateFarmerRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmer = yield farmer_model_1.default.findOneAndUpdate({ email: req.params.email }, { role: req.body.role }, { new: true });
        if (!farmer) {
            res.status(404).json({ message: "Farmer not found" });
        }
        res.json(farmer);
    }
    catch (error) {
        console.error("Error updating Farmer role:", error);
        res.status(500).json({
            message: "Error updating Farmer role",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});
exports.updateFarmerRole = updateFarmerRole;
const loginFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmer = yield farmer_model_1.default.findOne({ email: req.body.email });
        if (!farmer) {
            res.status(400).json({ message: "Farmer not found" });
        }
        else {
            res.status(200).json({ success: true });
        }
    }
    catch (error) {
        console.error("Error logging in Farmer:", error);
        res.status(500).json({
            message: "Error logging in Farmer",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});
exports.loginFarmer = loginFarmer;
