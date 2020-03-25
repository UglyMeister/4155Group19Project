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
                ref: 'Employee'
            }
        ],
        shiftsNeeded: [],
        shiftCount: [],
        description: {
            type: String,
            required: true
        }
    },
    { collection: 'skills' }
);

const SkillsModel = mongoose.model('Skills', skillsSchema);

module.exports = SkillsModel;
