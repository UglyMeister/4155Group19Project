var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var groupsSchema = new Schema(
    {
        name: String,
        ownerID: {
            type: ObjectId,
            ref: 'EmployerModel'
        },
        memberIDs: [
            {
                type: ObjectId,
                ref: 'EmployeeModel'
            }
        ],
        skillIDs: [
            {
                type: ObjectId,
                ref: 'SkillsModel'
            }
        ]
    },
    { collection: 'groups' }
);

const GroupsModel = mongoose.model('Groups', groupsSchema);

module.exports = GroupsModel;
