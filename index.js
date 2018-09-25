const dotenv = require('dotenv'),
    snoowrap = require('snoowrap');

dotenv.load()

// load reddit and subreddit instances
const reddit = new snoowrap({
    'userAgent':    process.env.REDDIT_USER_AGENT,
    'clientId':     process.env.REDDIT_CLIENT_ID,
    'clientSecret': process.env.REDDIT_CLIENT_SECRET,
    'username':     process.env.REDDIT_USERNAME,
    'password':     process.env.REDDIT_PASSWORD
}),
    anime = reddit.getSubreddit('anime');

async function pollThread() {
    let numComments;

    while (true) {
        // refresh thread
        const listing = await anime.search({
            'query': 'Casual Discussion Friday',
            'time': 'week',
            'sort': 'new'
        });

        const latestThread = await listing[0];

        // get comment list
        const comments = await latestThread.comments.fetchAll();
        numComments = latestThread.num_comments;

        const parents = await Promise.all(comments
            .filter(comment => {
                return !comment.stickied;
            })
            .map(comment => {
                return { 'author': comment.author.name,
                         'body' : comment.body };
            })
        );
    }
}

pollThread()
