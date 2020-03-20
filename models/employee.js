var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});

var employeeSchema = new mongoose.Schema(
    {
        name: String,
        id: {
            type: Number,
            unique: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        uname: {
            type: String,
            unique: true,
            required: true
        },
        pass: String,
        groupIDs: [],
        skillIDs: [],
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
