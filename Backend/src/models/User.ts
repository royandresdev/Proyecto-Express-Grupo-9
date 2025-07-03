import { DataTypes, Model } from 'sequelize'; // ¡Asegúrate de importar 'Model' también!
import sequelize from '../lib/sequelize';

// Define una interfaz para las propiedades que tu modelo 'User' tendrá
// 'id' y los timestamps son opcionales porque se generan automáticamente
export interface UserAttributes {
  id?: number;
  username: string;
  password: string; // Aquí se almacenará el hash de la contraseña
  createdAt?: Date;
  updatedAt?: Date;
}

// Extiende Model con tu interfaz para tipar correctamente las instancias
class User extends Model<UserAttributes> implements UserAttributes {
  // Estas propiedades deben coincidir con la interfaz y con las columnas de tu tabla
  public id!: number;
  public username!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicializa el modelo
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      // Explicitamente definido para que el tipado funcione bien con readonly
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      // Explicitamente definido
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: true,
  }
);

export default User;
