"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// @ts-ignore - Express types mismatch
router.post('/register', authController_1.register);
// @ts-ignore - Express types mismatch
router.post('/login', authController_1.login);
exports.default = router;
