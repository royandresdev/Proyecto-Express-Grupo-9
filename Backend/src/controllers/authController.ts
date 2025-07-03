import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { UserAttributes } from '../models/User'; // Importa el modelo Y la interfaz UserAttributes
import config from '../config/config';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res // <-- Aseguramos el return aquí
      .status(400)
      .json({ message: 'Nombre de usuario y contraseña son requeridos.' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res // <-- Aseguramos el return aquí
        .status(409)
        .json({ message: 'El nombre de usuario ya está registrado.' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ username, password: passwordHash });

    return res // <-- Aseguramos el return aquí
      .status(201)
      .json({
        message: 'Usuario registrado exitosamente.',
        userId: newUser.id,
      });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res // <-- ¡Aseguramos el return aquí en el catch!
      .status(500)
      .json({ message: 'Error interno del servidor.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res // <-- Aseguramos el return aquí
      .status(400)
      .json({ message: 'Nombre de usuario y contraseña son requeridos.' });
  }

  try {
    const user = (await User.findOne({
      where: { username },
    })) as UserAttributes;

    if (!user) {
      return res // <-- Aseguramos el return aquí
        .status(401)
        .json({ message: 'Credenciales inválidas. Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res // <-- Aseguramos el return aquí
        .status(401)
        .json({ message: 'Credenciales inválidas. Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.SECRET_CODE,
      { expiresIn: '1h' }
    );

    return res // <-- Aseguramos el return aquí
      .status(200)
      .json({ message: 'Login exitoso.', token: token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res // <-- ¡Aseguramos el return aquí en el catch!
      .status(500)
      .json({ message: 'Error interno del servidor.' });
  }
};
