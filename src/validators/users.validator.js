import { check, validationResult } from 'express-validator';

const validateUser = [
    check('name')
        .exists().withMessage('el nombre es requerido')
        .notEmpty().withMessage('el nombre no puede estar vacío')
        .isString().withMessage('el nombre debe ser texto'),

    check('email')
        .exists().withMessage('el email es requerido')
        .isEmail().withMessage('email inválido'),

    check('password')
        .exists().withMessage('la contraseña es requerida')
        .notEmpty().withMessage('la contraseña no puede estar vacía'),

    check('role_id')
        .exists().withMessage('role_id es requerido')
        .isNumeric().withMessage('role_id debe ser numérico'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'error de validación', data: errors.array() });
        }
        next();
    }
];

export default validateUser;