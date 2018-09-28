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

anime.config({
    'requestDelay': 5000,
    'debug': true
});

async function pollComments() {
    /*

    ***THIS SECTION IS BEING SAVED IN CASE IN CASE I NEED IT LATER***

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
        if (newestParent != parents[0]) {
            let i = 0;
            do {
                // handle new comments
            } while (parents[i++].name != newestParent)
            newestParent = await parents[0].name;
        }
        */

    let latestComment;

    while (true) {
        // retrieve new comments from subreddit
        const comments = await anime.getNewComments({
            'before': latestComment,
            'show': 'all',
            'amount': 500       // may or may not be too much
        });

        if (comments.length > 0) {
            latestComment = comments[0].name;
        }

        // get active thread IDs
        const threadID = await Promise.all(anime.search({
            'query':    'Casual Discussion Friday',
            'time':     'week',
            'sort':     'new',
            'amount':   2       // in case a thread gets locked late or something
        }).map(thread => thread.id));

        // filter to CDF comments
        await Promise.all(comments
            .filter(comment => {
                return (comment.link_id.substring(3) == threadID[0] || comment.link_id.substring(3) == threadID[1]);
            }).map(comment => {
                comment.toJSON();
            }).map(comment => {
                // TODO: handle new comments
                console.log(JSON.stringify(comment));
            })
        );
    }
}

pollComments();
