const express = require('express');

const userController = require('./../controllers/userController');

const router = express.Router();

router.route('/profile').get(userController.getProfile);

router.route('/createJob').post(userController.createJob);

router.route('/profile/group').post(userController.jobPage);

router.route('/profile/:groupName/skill');

router.route('/profile/:groupName/employee');

module.exports = router;
