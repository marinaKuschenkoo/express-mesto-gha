const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// router.get('/users', getUsers);
// router.get('/users/:userId', getUserById);
// router.post('/users', createUser);
// router.patch('/users/me', updateProfile);
// router.patch('/users/me/avatar', updateAvatar);

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
