const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

// 64a5ea224e759e5c95e7f9e3
app.use((req, res, next) => {
  req.user = {
    _id: '64a5ea224e759e5c95e7f9e3',
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
