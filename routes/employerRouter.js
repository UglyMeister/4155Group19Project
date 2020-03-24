const express = require('express');

const userController = require('./../controllers/userController');

const router = express.Router();

router.route('/profile').get(userController.getProfile);

router.route('/createJob').post(userController.createJob);

router.route('/profile/:groupName').get(userController.jobPage);

router.route('/:groupName/skills');

router.route('/:groupName/:employee');

module.exports = router;
