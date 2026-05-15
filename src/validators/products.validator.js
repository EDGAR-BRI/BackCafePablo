import { check, validationResult } from 'express-validator';

const validateProduct = [
    check('nombre')
        .exists().withMessage('el nombre es requerido')
        .notEmpty().withMessage('el nombre no puede estar vacío')
        .isString().withMessage('el nombre debe ser texto'),

    check('precio')
        .exists().withMessage('el precio es requerido')
        .isNumeric().withMessage('el precio debe ser numérico'),

    check('cantidad')
        .exists().withMessage('la cantidad es requerida')
        .isNumeric().withMessage('la cantidad debe ser numérica'),

    check('categoria_id')
        .exists().withMessage('categoria_id es requerido')
        .isNumeric().withMessage('categoria_id debe ser numérico'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: 'error de validación', data: errors.array() });
        }
        next();
    }
];

export default validateProduct;
