const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
let database;

async function connect() {
        const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
        database = client.db('APICollection');
}

function getDB() {
        if (!database) {
                throw 'Error connecting to database';
        }
        return database;
}

module.exports = {
        connectionToDatabase: connect,
        getDB: getDB,
        ObjectId: ObjectId,
};
