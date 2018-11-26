// maybe I should organize these better
const dotenv = require('dotenv'),
    snoowrap = require('snoowrap'),
    snoostorm = require('snoostorm'),
    express = require('express'),
    app = express();
    fs = require('fs'),
    markdown = require('markdown').markdown,
    MongoClient = require('mongodb').MongoClient,
    helpers = require('./helpers.js'),
    page = require('./page.js');
var server = app.listen(8080);
var feed = require('socket.io').listen(server);

/**
 * 
 * BACKEND STUFF
 *
 */

dotenv.load();

// get thread history
var threads = [];
helpers.loadThreadList( (err, arr) => {
    if (err) {
		console.log(err);
        process.exit(1);
    }
	threads = arr.map(d => d._id);
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
		helpers.store(obj);
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
        helpers.store(obj);
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
    helpers.getHistory( (err, arr) => {
        if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, arr);
    })
});
app.get("/v1/thread.json", (req, res) => {
	helpers.getLatestThread( (err, arr) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, arr);
	});
});
app.get("/v1/:comment_id.json", (req, res) => {
    helpers.getComment(req.params.comment_id, (err, comment) => {
        if (err) helpers.sendFailure(res, 500, err);
        helpers.sendSuccess(res, comment);
    });
});
app.get("*", (req, res) => {
    res.writeHead(404, {"Content-Type" : "application/json" });
	res.end(JSON.stringify(helpers.invalid_resource()) + '\n');
});
