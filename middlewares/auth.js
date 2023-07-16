// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/ValidationError');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies.jwt;
  if (!authorization) {
    throw new ValidationError('Необходима авторизация');
  }
  const token = authorization;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
    res.cookie('token', token, {
      httpOnly: true,
    });
  } catch (err) {
    throw new ValidationError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
