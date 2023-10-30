const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller')
router.get('/', homeController.home)

// const usersController = require('../controllers/users_controller');

// router.get('/profile', usersController.profile);

router.use('/user', require('./user'))


module.exports = router;