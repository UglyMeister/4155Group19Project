var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});

var employeeSchema = new mongoose.Schema(
    {
        name: String,
        id: Number,
        email: String,
        uname: String,
        pass: String,
        groupIDs: [],
        monAvail: [],
        tueAvail: [],
        wedAvail: [],
        thAvail: [],
        friAvail: [],
        satAvail: [],
        sunAvail: []
    },
    { collection: 'employee' }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
