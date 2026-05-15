import { authService } from '../services/auth.services.js';

class AuthController {
    constructor() {}

    login = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                mensaje: 'Email y contraseña son requeridos' 
            });
        }

        const { message, status, data } = await authService.login(email, password);
        res.status(status).json({ mensaje: message, data });
    };
}

export const authController = new AuthController();
