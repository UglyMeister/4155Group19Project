const express = require('express');

const userController = require('./../controllers/userController');

const router = express.Router();

router.route('/').get(userController.getProfile).post(userController.createJob);

router.route('/group').get(userController.employerJobPage).post(userController.createSkill);

router.route('/profile/:groupName/skill');

router.route('/profile/:groupName/employee');

module.exports = router;
