const User = require('../models/user');

function getUsers(req, res) {
  return User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: ' Запрашиваемый пользователь не найден' });
        return;
      }

      res.status(200).send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: ' Запрашиваемый пользователь не найден' });
        return;
      }

      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: ' Запрашиваемый пользователь не найден' });
        return;
      }

      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
