/* eslint-disable no-unused-vars */
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const BadRequestError = require('./errors/BadRequestError');
const AlreadyExistError = require('./errors/AlreadyExistError');
const InternalServerError = require('./errors/InternalServerError');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  throw new NotFoundError('Страницы не существует');
});
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.send({ message: err.message });
    return;
  }
  if (err instanceof mongoose.Error.ValidationError) {
    throw new BadRequestError('Переданы некорректные данные');
  }
  if (err.code === 11000) {
    throw new AlreadyExistError('Такой email уже зарегистрирован');
  }

  throw new InternalServerError('На сервере произошла ошибка');
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен');
});
