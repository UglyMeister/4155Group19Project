const EmployerModel = require('./../models/employer');

exports.getEmployer = async (req, res) => {
    try {
        const employer = await EmployerModel.findById(req.params.uname);
        if (employer.uname === req.params.query) {
            res.render('employer', {data: '', loggedIn: req.session.loggedIn});
        }
    } catch (e) {
        console.log(e);
    }
};
