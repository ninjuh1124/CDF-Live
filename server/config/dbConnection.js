const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI ? process.env.MONGO_URI: 'mongodb://localhost/fridaydotmoe';

/** Returns promise to db connection. **/
module.exports = {
	connect: () => MongoClient.connect(uri)
}
