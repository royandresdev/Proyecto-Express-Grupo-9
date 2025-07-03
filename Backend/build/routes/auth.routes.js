"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Importa Router desde 'express'
const authController_1 = require("../controllers/authController"); // Importa tus controladores
const router = (0, express_1.Router)(); // ¡IMPORTANTE! Crea una instancia de Router aquí
// Define las rutas POST usando los controladores
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
exports.default = router; // ¡MUY IMPORTANTE! Exporta la instancia del router por defecto
