"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize"); // ¡Asegúrate de importar 'Model' también!
const sequelize_2 = __importDefault(require("../lib/sequelize"));
// Extiende Model con tu interfaz para tipar correctamente las instancias
class User extends sequelize_1.Model {
}
// Inicializa el modelo
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: new sequelize_1.DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        // Explicitamente definido para que el tipado funcione bien con readonly
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        // Explicitamente definido
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: 'users',
    sequelize: sequelize_2.default,
    timestamps: true,
});
exports.default = User;
