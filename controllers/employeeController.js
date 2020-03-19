const EmployeeModel = require('./../models/employee');

exports.getEmployee = async (req, res) => {
    try {
        const employee = await EmployeeModel.findById(req.params.uname);
        if (employee.uname === req.params.query) {
            res.render('employee');
        }
    } catch (e) {
        console.log(e);
    }
};
