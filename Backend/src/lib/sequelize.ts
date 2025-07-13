import { Sequelize } from 'sequelize';
import config from '../config/config';

const sequelize = new Sequelize(
  config.DB_DATABASE,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    port: Number(config.DB_PORT), // Aseguramos que el puerto sea un número
    dialect: 'mysql', // Especifica el dialecto de la base de datos
    logging: false, // Desactiva el log de SQL en consola para un output más limpio
  }
);

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a la base de datos con Sequelize.');
  } catch (error) {
    console.error('Error de conexión a la base de datos con Sequelize:', error);
  }
}

export default sequelize;
