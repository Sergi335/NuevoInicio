const { check } = require('express-validator')
const { validateResults } = require('../helpers/handleValidators')

const validateEditLink = [
  check('nombre')
    .exists()
    .notEmpty()
    .isLength({ min: 1, max: 35 }),
  check('URL')
    .exists()
    .notEmpty()
    .isURL(),
  (req, res, next) => {
    return validateResults(req, res, next)
  }
]
const validateCreateLink = [
  check('nombre')
    .exists()
    .notEmpty()
    .isLength({ min: 1, max: 135 }),
  check('URL')
    .exists()
    .notEmpty()
    .isURL(),
  (req, res, next) => {
    return validateResults(req, res, next)
  }
]

module.exports = { validateEditLink, validateCreateLink }
