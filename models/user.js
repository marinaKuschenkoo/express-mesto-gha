// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://a.ppy.sh/9958822?1615128896.jpeg',
  },
});

module.exports = mongoose.model('user', userSchema);
