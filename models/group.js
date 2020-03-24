var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});
//var db = mongoose.connection;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var groupsschema = new mongoose.schema(
    {
        name: String,
        ownerid: [
            {
                type: ObjectId,
                ref: 'employer'
            }
        ],
        memberIds: [
            {
                type: ObjectId,
                ref: 'employee'
            }
        ],
        skillIds: [
            {
                type: ObjectId,
                ref: 'skill'
            }
        ]
    },
    { collection: 'groups' }
);

const GroupsModel = mongoose.model('Groups', groupsSchema);

module.exports = GroupsModel;
