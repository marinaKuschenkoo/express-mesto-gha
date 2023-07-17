/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/ValidationError');
const { secret } = require('../constants');

// eslint-disable-next-line no-unused-vars
module.exports = (req, res, next, err) => {
  console.log(secret);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return err.message;
    throw new ValidationError('Необходима авторизация!');
    // res.status(VALIDATION_ERROR).send({ message: 'Необходима авторизация!' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (error) {
    throw new ValidationError('Необходима авторизация!');
  }
  req.user = payload;
  next();
};
