"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farmer_controller_1 = require("../controllers/farmer.controller");
const address_controller_1 = require("../controllers/address.controller");
const router = (0, express_1.Router)();
router.post("/farmers", farmer_controller_1.createFarmer);
router.put("/farmers/:email/addAddress", farmer_controller_1.addFarmerAddress);
router.get("/farmers/:email/get/address", farmer_controller_1.getFarmerAddress);
router.get("/farmers", farmer_controller_1.getFarmers);
router.get("/farmers/:email", farmer_controller_1.getFarmer);
router.put("/farmers/:email", farmer_controller_1.updateFarmer);
router.put("/farmers/:email/update/name", farmer_controller_1.updateFarmerName);
router.put("/farmers/:email/update/phone", farmer_controller_1.updateFarmerPhone);
router.put("/farmers/update/Address/:email", farmer_controller_1.updateFarmerAddress);
router.put("/farmers/:email/update/email", farmer_controller_1.updateFarmerEmail);
router.put("/farmers/:email/update/is_verified", farmer_controller_1.updateFarmerVerifiedStatus);
router.post("/farmers/:email/add/product/", farmer_controller_1.addProduct);
router.delete("/farmers/:email/delete/product/:productId", farmer_controller_1.deleteProduct);
router.delete("/farmers/:email/delete/address/:addressId", farmer_controller_1.deleteFarmerAddress);
router.get("/farmers/:email/get/earnings", farmer_controller_1.getEarnings);
router.get("/farmers/:email/get/products", farmer_controller_1.getProducts);
router.get("/farmers/:email/get/orders", farmer_controller_1.getOrders);
router.post("/farmers/:email/add/order", farmer_controller_1.addOrder);
router.delete("/farmers/:email", farmer_controller_1.deleteFarmer);
router.post("/address", address_controller_1.createAddress);
router.get("/address", address_controller_1.getAddresses);
router.get("/address/:id", address_controller_1.getAddress);
router.put("/address/:id", address_controller_1.updateAddress);
router.post("/login", farmer_controller_1.loginFarmer);
router.delete("/address/:id", address_controller_1.deleteAddress);
exports.default = router;
