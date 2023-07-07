const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id, { lean: false }, { runValidators: true })
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.status(200).send({ user }))
    // .catch((err) => {
    //   if (err.message === 'NotFound') {
    //     res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    //     return;
    //   }
    //   if (err.name === 'CastError') {
    // eslint-disable-next-line max-len
    //     res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя' });
    //   } else {
    //     res.status(500).send({ message: 'Ошибка по умолчанию' });
    //   }
    // });
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({
          message: 'переданы некорректные данные',
          err: err.message,
        });
      } else if (err.status === 404) {
        res.status(404).send({ message: 'Пользователь не найден' })
      } else {
        res.status(500).send({
          message: 'Что-то не так',
        });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
