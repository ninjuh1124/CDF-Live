const dotenv = require('dotenv'),
    snoowrap = require('snoowrap'),
    snoostorm = require('snoostorm'),
    express = require('express'),
    app = express();
    fs = require('fs'),
    helpers = require('./helpers.js'),
    page = require('./page.js');
var server = app.listen(8080);
var feed = require('socket.io').listen(server);

/**
 * 
 * BACKEND STUFF
 *
 */

dotenv.load()

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

var threadNames = ['t3_9perly', 't3_9ji73y'];	// retains last 2 threads
var history = [];							// retains last 100 comments

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
    if (thread.title.includes("Casual Discussion Friday") && thread.author == "AutoModerator") {
        threadNames.pop();
        threadNames.unshift(thread.name);
        console.log("*****NEW THREAD HYPE*****");
        console.log("------------------------------------------------------------");
    }
});



/**
 * checks /r/anime every minute
 * handles comments posted to active CDF threads
 */
commentStream.on("comment", comment => {
    if (threadNames.includes(comment.link_id)) {
        let obj = ((comment) => {
            // turn the comment into something more usable
            comment = comment.toJSON();
   			return {
                'kind': 'comment',
                'author': comment.author,
                'id': comment.name,
                'permalink': 'https://reddit.com' + comment.permalink,
                'parentID': comment.parent_id,
                'body': comment.body,
                'body_html': comment.body_html
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                    .replace('<a href="/u/', '<a href="https://reddit.com/u/')
                    .replace('<a href="/r/', '<a href="https://reddit.com/r/')
                    .replace('<p>', '<p class="text-justify">')
    		}
        })(comment);
        history.push(obj);
        if (history.length > 100) {
            history.shift();
        }
        feed.emit('comment', obj);
        //console.log(obj.body);
        //console.log("------------------------------------------------------------");
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
app.use((req, res, next) => {
    console.log("Incoming request: " + req.method + " " + req.url);
    next();
});

app.get("/", (req, res) => {
    res.redirect("/home");
    res.end();
});
app.get("/home", page.generate);
