const { check } = require('express-validator')
const { validateResults } = require('../helpers/handleValidators')

const validateEditDesktop = [
  check('nombreOld')
    .exists()
    .notEmpty(),
  check('nombre')
    .exists()
    .notEmpty()
    .isLength({ min: 1, max: 35 }),
  (req, res, next) => {
    return validateResults(req, res, next)
  }
]

module.exports = { validateEditDesktop }