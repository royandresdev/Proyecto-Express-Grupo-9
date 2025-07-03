"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = testConnection;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const sequelize = new sequelize_1.Sequelize(config_1.default.DB_DATABASE, config_1.default.DB_USER, config_1.default.DB_PASSWORD, {
    host: config_1.default.DB_HOST,
    port: Number(config_1.default.DB_PORT), // Aseguramos que el puerto sea un número
    dialect: 'mysql', // Especifica el dialecto de la base de datos
    logging: false, // Desactiva el log de SQL en consola para un output más limpio
});
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a la base de datos con Sequelize.');
    }
    catch (error) {
        console.error('Error de conexión a la base de datos con Sequelize:', error);
    }
}
exports.default = sequelize;
