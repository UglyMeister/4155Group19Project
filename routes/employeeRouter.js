const express = require('express');

const employeeController = require('./../controllers/employeeController');

const router = express.Router();

router.get(employeeController.getEmployee);

router.route('/employee/:id/editSkills');

router.route('/employee/:id/editAssociates');

module.exports = router;
