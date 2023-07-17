/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const InterdictionError = require('../errors/InterdictionError');
const InternalServerError = require('../errors/InternalServerError');
const AlreadyExistError = require('../errors/AlreadyExistError');
const ValidationError = require('../errors/ValidationError');
const { secret } = require('../constants');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secret, {
        expiresIn: '7d',
      });
      res.send({ message: 'Авторизация прошла успешно', token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send({ user });
    })
    .catch(next);
};
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      res.send({ users });
    })
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .catch(() => {
      throw new AlreadyExistError('Пользователь с таким email уже существует');
    })
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          email: user.email,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(' Запрашиваемый пользователь не найден');
      }

      res.send({ user });
    })
    .catch(next);
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(' Запрашиваемый пользователь не найден');
      }

      res.send({ user });
    })
    .catch(next);
};
