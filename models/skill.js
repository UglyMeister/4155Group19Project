var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});
//var db = mongoose.connection;

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var skillsSchema = new mongoose.Schema(
    {
        name: String,
        userIDs: [
            {
                type: ObjectId,
                ref: 'EmployeeModel'
            }
        ],
        shifts: {
            monShift: [
                {
                    shiftsNeeded: [],
                    shiftCount: []
                }
            ],
            tueShift: [
                {
                    shiftsNeeded: [],
                    shiftCount: []
                }
            ],
            wedShift: [
                {
                    shiftsNeeded: [],
                    shiftCount: []
                }
            ],
            thShift: [
                {
                    shiftsNeeded: [],
                    shiftCount: []
                }
            ],
            friShift: [
                {
                    shiftsNeeded: [],
                    shiftCount: []
                }
            ],
            satShift: [
                {
                    shiftsNeeded: [],
                    shiftCount: []
                }
            ],
            sunShift: [
                {
                    shiftsNeeded: [],
                    shiftCount: []
                }
            ]
        },
        description: {
            type: String
        }
    },
    { collection: 'skills' }
);

const SkillsModel = mongoose.model('Skills', skillsSchema);

module.exports = SkillsModel;
