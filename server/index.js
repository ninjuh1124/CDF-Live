// maybe I should organize these better
const dotenv = require('dotenv'),
    snoowrap = require('snoowrap'),
    snoostorm = require('snoostorm'),
    express = require('express'),
    app = express();
    fs = require('fs'),
    helpers = require('./helpers.js'),
    MongoClient = require('mongodb').MongoClient,
    page = require('./page.js');
var server = app.listen(8080);
var feed = require('socket.io').listen(server);

/**
 * 
 * BACKEND STUFF
 *
 */

dotenv.load();
const uri = "mongodb://localhost/CDF-Live";

// get thread history
var threads = [];
MongoClient.connect(uri, (err, db) => {
    let coll = db.collection('threads');
    coll.find({'kind': 'submission'})
        .toArray( (err, arr) => {
            threads = arr.map(d => d._id);
        });
    db.close();
});

// load reddit and subreddit instances
const cred = {
    'userAgent':    process.env.REDDIT_USER_AGENT,
    'clientId':     process.env.REDDIT_CLIENT_ID,
    'clientSecret': process.env.REDDIT_CLIENT_SECRET,
    'username':     process.env.REDDIT_USERNAME,
    'password':     process.env.REDDIT_PASSWORD
};

const reddit = new snoowrap(cred),
    client = new snoostorm(cred),
    anime = reddit.getSubreddit('anime');

reddit.config({
    'requestDelay': 5000,
    'debug': true
});

var commentStream = client.CommentStream({
    'subreddit': 'anime',
    'results': 100,
    'pollTime': 5000
});

var threadStream = client.SubmissionStream({
    'subreddit': 'anime',
    'results': 100,
    'pollTime': 60000
});

/**
 * checks /r/anime thread stream every minute for a new CDF thread
 * and updates the active thread list accordingly
 */
threadStream.on("submission", thread => {
    if (helpers.isNewCDF(thread)) {
        let obj = (helpers.handleThread(thread));
        MongoClient.connect(uri, (err, db) => {
            db.collection('threads').insertOne(obj)
            db.close();
        });
        threads.push(obj._id);
        console.log("NEW THREAD HYPE: " + obj.permalink);
        feed.emit('thread', obj);
    }
});

/**
 * checks /r/anime every minute
 * handles comments posted to active CDF threads
 */
commentStream.on("comment", comment => {
    if (threads.includes(comment.link_id)) {
        let obj = helpers.handleComment(comment); 
        MongoClient.connect(uri, (err, db) => {
            db.collection('comments').insertOne(obj);
            db.close();
        });
		feed.emit('comment', obj)
    }
});


/**
 *
 * FRONT END STUFF
 *
 */

app.use((req, res, next) => {
    res.set('X-Clacks-Overhead', 'GNU Terry Pratchet');
    next();
});
app.use(express.static(__dirname + "/../static"));

app.get("/", (req, res) => {
    res.redirect("/home");
    res.end();
});
app.get("/:pageName", page.generate);
app.get("/v1/history.json", (req, res) => {
    MongoClient.connect(uri, (err, db) => {
        db.collection('comments')
            .find({})
            .sort({id: -1})
            .limit(200)
            .toArray( (err, arr) => {
                if (err) {
                    console.log(err);
                }
                helpers.sendSuccess(res, arr);

                db.close();
            });
    });
});
