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
        'requestDelay': 2000,
        'debug': true
    });

async function pollComments() {
    let latestComment;

    /*

    ***THIS SECTION IS BEING SAVED IN CASE IN CASE I
    RANDOMLY DECIDE TO CHANGE HOW THIS PROGRAM FUNCTIONS***

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

    while (true) {
        // retrieve new comments from subreddit
        const comments = await anime.getNewComments({
            'before': latestComment,
            'show': 'all',
            'amount': 500       // may or may not be too much
        });

        // filter to CDF comments
        await Promise.all(comments
            .filter(comment => {
                const threadID = comment.link_id;
                const threadTitle = Promise.resolve(reddit.getSubmission(threadID.substring(3)).title);                 // fix: promise rejection
                return ("Casual Discussion Friday" == threadTitle.substring(0, "Casual Discussion Friday".length));     // i deserve to be slapped for this line
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
