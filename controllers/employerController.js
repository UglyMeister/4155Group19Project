const EmployerModel = require('./../models/employer');

exports.getEmployer = async (req, res) => {
    try {
        const employer = await EmployerModel.findById(req.params.uname);
        if (employer.uname === req.params.query) {
            res.render('employer');
        }
    } catch (e) {
        console.log(e);
    }
};
