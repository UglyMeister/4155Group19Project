const express = require('express');

const userController = require('./../controllers/userController');
const scheduleController = require('./../controllers/scheduleController');

const router = express.Router();

router.route('/').get(userController.getProfile).post(userController.createJob);

router.route('/group').get(userController.employerJobPage).post(userController.createSkill);

router
    .route('/group/skill')
    .get(userController.getUpdateSkillPage)
    .post(userController.deleteSkillPage)
    .patch(userController.updateSkillPage);

//this will handle the routing to the scheduling page
router
    .route('/group/schedule')
    .get(scheduleController.generateSchedule)
    .post(scheduleController.scheduleHandler);

module.exports = router;
