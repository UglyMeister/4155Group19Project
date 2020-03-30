const express = require('express');

const userController = require('./../controllers/userController');

const router = express.Router();

router.route('/').get(userController.getProfile).post(userController.addJob);

router.route('/group').get(userController.employeeJobPage);

router.route('/group/skills').get(userController.employeeUpdateSkill);

router.route('/group/availability').post(userController.updateAvailability);

module.exports = router;
