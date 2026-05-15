import { check, validationResult } from 'express-validator';

const validateRole = [
  check('name')
    .exists().withMessage('el nombre es requerido')
    .notEmpty().withMessage('el nombre no puede estar vacío')
    .isString().withMessage('el nombre debe ser texto'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "error de validación",
        data: errors.array()
      });
    }
    next();
  }
];

export default validateRole;