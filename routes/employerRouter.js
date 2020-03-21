const express = require('express');

const userController = require('./../controllers/userController');

const router = express.Router();

router.route('/profile').get(userController.getProfile);

router.route('/employer/:id/editSkills');

router.route('/employer/:id/editAssociates');

module.exports = router;
