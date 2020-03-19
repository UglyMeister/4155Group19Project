const employeeModel = require('./../models/employee');
const employerModel = require('./../models/employer');

exports.createUser = async (req, res, next) => {
    try {
        if (req.body.signupcheck == 'employee') {
            const newEmployee = await employeeModel.create(req.body);
        } else {
            const newEmployer = await employerModel.create(req.body);
        }
        res.redirect('/');
    } catch (e) {
        res.render('signup', {
            data: 'a user with that username/email already exists, please enter a new username'
        });
        console.log(e);
    }
};

exports.userLogin = async (req, res, next) => {
    const username = req.body.uname;
    const password = req.body.pass;
    if (req.body.logincheck == 'employee') {
        const employee = await employeeModel.findOne({
            uname: new RegExp('^' + username + '$', 'i')
        });
        console.log(employee);
        if (employee.pass == password) {
            console.log('test');
            res.render('employee');
        } else {
            res.render('index', { data: 'incorrect username or password' });
        }
    } else {
        const employer = await employerModel.findOne({
            uname: new RegExp('^' + username + '$', 'i')
        });
        if (employer.pass == password) {
            res.render('employer');
        } else {
            res.render('index', { data: 'incorrect username or password' });
        }
    }
};
