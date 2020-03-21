const express = require('express');

const userController = require('./../controllers/userController');

const router = express.Router();

router.route('/profile').get(userController.getProfile);

router.route('/employee/:id/editSkills');

router.route('/employee/:id/editAssociates');

module.exports = router;
