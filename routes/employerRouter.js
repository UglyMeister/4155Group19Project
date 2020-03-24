const express = require('express');

const userController = require('./../controllers/userController');

const router = express.Router();

router.route('/profile').get(userController.getProfile);

router.route('/:groupName');

router.route('/:groupName/skills');

router.route('/:groupName/:employee');

module.exports = router;
