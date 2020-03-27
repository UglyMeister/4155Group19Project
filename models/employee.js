var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var employeeSchema = new mongoose.Schema(
    {
        name: String,
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
        groupIDs: [
            {
                type: ObjectId,
                ref: 'GroupsModel'
            }
        ],
        skillIDs: [
            {
                type: ObjectId,
                ref: 'SkillsModel'
            }
        ],
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

const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel;
