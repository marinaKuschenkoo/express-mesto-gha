/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
const jwt = require('jsonwebtoken');
const { VALIDATION_ERROR } = require('../errors/errors');
const { secret } = require('../constants');

module.exports = (req, res, next) => {
  console.log(secret);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(VALIDATION_ERROR).send({ message: 'Необходима авторизация!' });
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      res.status(VALIDATION_ERROR).send({ message: 'Необходима авторизация' });
    }
    req.user = payload;
    next();
  }
};
