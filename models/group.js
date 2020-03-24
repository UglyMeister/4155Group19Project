var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var groupsSchema = new Schema(
    {
        groupName: String,
        ownerId: {
            type: ObjectId,
            ref: 'EmployerModel'
        },
        memberIds: [
            {
                type: ObjectId,
                ref: 'Employee'
            }
        ],
        skillIds: [
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
