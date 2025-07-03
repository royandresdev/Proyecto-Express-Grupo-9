import { Router } from 'express'; // Importa Router desde 'express'
import { register, login } from '../controllers/authController'; // Importa tus controladores

const router = Router(); // ¡IMPORTANTE! Crea una instancia de Router aquí

// Define las rutas POST usando los controladores
router.post('/register', register);
router.post('/login', login);

export default router; // ¡MUY IMPORTANTE! Exporta la instancia del router por defecto
