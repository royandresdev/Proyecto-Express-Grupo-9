"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User")); // Importa el modelo Y la interfaz UserAttributes
const config_1 = __importDefault(require("../config/config"));
const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res // <-- Aseguramos el return aquí
            .status(400)
            .json({ message: 'Nombre de usuario y contraseña son requeridos.' });
    }
    try {
        const existingUser = await User_1.default.findOne({ where: { username } });
        if (existingUser) {
            return res // <-- Aseguramos el return aquí
                .status(409)
                .json({ message: 'El nombre de usuario ya está registrado.' });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
        const newUser = await User_1.default.create({ username, password: passwordHash });
        return res // <-- Aseguramos el return aquí
            .status(201)
            .json({
            message: 'Usuario registrado exitosamente.',
            userId: newUser.id,
        });
    }
    catch (error) {
        console.error('Error al registrar usuario:', error);
        return res // <-- ¡Aseguramos el return aquí en el catch!
            .status(500)
            .json({ message: 'Error interno del servidor.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res // <-- Aseguramos el return aquí
            .status(400)
            .json({ message: 'Nombre de usuario y contraseña son requeridos.' });
    }
    try {
        const user = (await User_1.default.findOne({
            where: { username },
        }));
        if (!user) {
            return res // <-- Aseguramos el return aquí
                .status(401)
                .json({ message: 'Credenciales inválidas. Usuario no encontrado.' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res // <-- Aseguramos el return aquí
                .status(401)
                .json({ message: 'Credenciales inválidas. Contraseña incorrecta.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, config_1.default.SECRET_CODE, { expiresIn: '1h' });
        return res // <-- Aseguramos el return aquí
            .status(200)
            .json({ message: 'Login exitoso.', token: token });
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res // <-- ¡Aseguramos el return aquí en el catch!
            .status(500)
            .json({ message: 'Error interno del servidor.' });
    }
};
exports.login = login;
