const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const InterdictionError = require('../errors/InterdictionError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карты не найдены');
      }
      res.send({ cards });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card && card.owner.toString() === req.user._id) {
        return res.send({ data: card });
      } if (card && !(card.owner.toString() === req.user._id)) {
        throw new InterdictionError('Невозможно удалить карту с другим _id пользователя');
      }
      throw new NotFoundError('Карта с данным _id не найдена');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Некорректные поля при создании карточки');
      }
      res.send(card);
    })
    .catch(next);
};

module.exports.setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карта с указанным _id не найдена');
      }
    })
    .catch(next);
};
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карта с указанным _id не найдена');
      }
    })
    .catch(next);
};
