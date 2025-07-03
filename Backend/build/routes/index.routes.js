"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Asegúrate de que importas Router directamente de 'express'
const auth_routes_1 = __importDefault(require("./auth.routes")); // Importa tu router de autenticación
const router = (0, express_1.Router)(); // ¡IMPORTANTE! Crea una instancia de Router aquí
// Aquí puedes añadir otras rutas si las tienes
// router.use("/some-other-path", someOtherRoutes);
// Usa el router de autenticación bajo el prefijo "/auth"
// Aquí es donde el error está señalando, asegurémonos de que 'authRoutes' sea lo que esperamos.
router.use('/auth', auth_routes_1.default); // Línea 8 en tu archivo
exports.default = router;
