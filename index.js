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
    let newestParent;

    // get latest thread
    const listing = await anime.search({
        'query': 'Casual Discussion Friday',
        'time': 'week',
        'sort': 'new'
    });
    let latestThread = await listing[0];

    while (!latestThread.locked) {
        latestThread = await latestThread.refresh()
        // get comment list
        const comments = await latestThread.comments.fetchAll();

        // load comment list
        const parents = await Promise.all(comments
            .filter(comment => {
                return !comment.stickied;
            })
            .map(comment => {
                comment.toJSON()
            })
        );

        // check for new comments
        // TODO
    }
}

pollThread()
