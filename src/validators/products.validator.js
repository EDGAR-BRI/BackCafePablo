import { check, validationResult } from 'express-validator';

const validateProduct = [
    check('name')
        .exists().withMessage('el nombre es requerido')
        .notEmpty().withMessage('el nombre no puede estar vacío')
        .isString().withMessage('el nombre debe ser texto'),

    check('price')
        .exists().withMessage('el precio es requerido')
        .isNumeric().withMessage('el precio debe ser numérico'),

    check('quantity')
        .exists().withMessage('la cantidad es requerida')
        .isNumeric().withMessage('la cantidad debe ser numérica'),

    check('category_id')
        .exists().withMessage('category_id es requerido')
        .isNumeric().withMessage('category_id debe ser numérico'),

    check('area_id')
        .exists().withMessage('area_id es requerido')
        .isNumeric().withMessage('area_id debe ser numérico'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'error de validación', data: errors.array() });
        }
        next();
    }
];

export default validateProduct;