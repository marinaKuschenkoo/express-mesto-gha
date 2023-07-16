// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const {
  VALIDATION_ERROR,
} = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(VALIDATION_ERROR).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
    res.cookie('token', token, {
      httpOnly: true,
    });
  } catch (err) {
    res
      .status(VALIDATION_ERROR).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
