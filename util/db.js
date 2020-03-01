var getAll = function(db){
    return promise = db.find({}).exec();
};

var getOne = function(db, uname){
    return promise = db.find({uname: uname}).exec();
};

var oneExists = function(uname){
    if(getOne)
    return true;
    else
    return false;
};

module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.oneExists = oneExists;