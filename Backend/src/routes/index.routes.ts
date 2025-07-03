import { Router } from 'express'; // Asegúrate de que importas Router directamente de 'express'
import authRoutes from './auth.routes'; // Importa tu router de autenticación

const router = Router(); // ¡IMPORTANTE! Crea una instancia de Router aquí

// Aquí puedes añadir otras rutas si las tienes
// router.use("/some-other-path", someOtherRoutes);

// Usa el router de autenticación bajo el prefijo "/auth"
// Aquí es donde el error está señalando, asegurémonos de que 'authRoutes' sea lo que esperamos.
router.use('/auth', authRoutes); // Línea 8 en tu archivo

export default router;
