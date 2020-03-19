const express = require('express');

const employerController = require('./../controllers/employerController');

const router = express.Router();

router.get(employerController.getEmployer);

router.route('/employer/:id/editSkills');

router.route('/employer/:id/editAssociates');

module.exports = router;
