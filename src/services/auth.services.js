import prisma from '../config/prisma.config.js';
import bcrypt from 'bcrypt';

export class AuthService {
    constructor() {}

    login = async (email, password) => {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { email },
                include: { rol: true }
            });

            if (!usuario || !usuario.estado) {
                return { message: 'Credenciales inválidas', status: 401, data: null };
            }

            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                return { message: 'Credenciales inválidas', status: 401, data: null };
            }

            const { password: _, ...usuarioSinPassword } = usuario;

            return { 
                message: 'Login exitoso', 
                status: 200, 
                data: usuarioSinPassword 
            };
        } catch (error) {
            return { message: error.message, status: 500, data: null };
        }
    };
}

export const authService = new AuthService();
