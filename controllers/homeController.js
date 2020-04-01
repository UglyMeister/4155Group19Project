const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');

exports.createUser = async (req, res, next) => {
    try {
        console.log(req.body);
        if (req.body.signupcheck == 'employee') {
            const newEmployee = await EmployeeModel.create(req.body);
        } else {
            const newEmployer = await EmployerModel.create(req.body);
        }
        res.redirect('/');
    } catch (e) {
        res.render('signup', {
            data: 'a user with that username/email already exists, please enter a new username',
            loggedIn: false
        });
        console.log(e);
    }
};

exports.userLogin = async (req, res, next) => {
    try {
        const username = req.body.uname;
        const password = req.body.pass;
        if (req.body.logincheck == 'employee') {
            const employee = await EmployeeModel.findOne({
                uname: new RegExp('^' + username + '$', 'i')
            });
            //console.log(employee);
            if (employee != null && employee.pass == password) {
                //session stuff added here
                req.session.profile = employee;
                req.session.type = 'employee';
                console.log(req.session.profile);
                req.session.save();
                //session stuff above
                //console.log('test');
                //WANT TO CHANGE THIS TO A REDIRECT TO /PROFILE, SHOULD ALSO BE THE SAME FOR THE EMPLOYER VIEW
                //res.render('employee');
                res.redirect('/employee/');
            } else {
                res.render('index', { data: 'incorrect username or password', loggedIn: false });
            }
        } else {
            const employer = await EmployerModel.findOne({
                uname: new RegExp('^' + username + '$', 'i')
            });
            //console.log(employer);
            if (employer != null && employer.pass == password) {
                req.session.profile = employer;
                req.session.type = 'employer';
                console.log(req.session.profile);
                req.session.save();
                res.redirect('/employer/');
                //res.render('employer');
            } else {
                res.render('index', { data: 'incorrect username or password', loggedIn: false });
            }
        }
    } catch (e) {
        console.log(e);
    }
};
