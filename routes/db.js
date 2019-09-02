const mongo_client = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
const db_name = 'crud_mongodb';
const url = 'mongodb://localhost:27017';
const mongoOptions = {useNewUrlParser : true};

const state = {
    db : null
};

const connect = (cb) => {
    if(state.db){
        cb();
        console.log("state db");
    }
    else{
        mongo_client.connect(url, mongoOptions, (err, client) => {
            if (err){
                console.log(err);
                cb(err);
            }
            else{
                state.db = client.db(db_name);
                console.log("Connected");
                cb();
            }
        });
    }
}

const getprimaryKey = (id) => {
    return objectID(id);
}

const get_db = () => {
    return state.db;
}

module.exports = {get_db, getprimaryKey, connect}; 