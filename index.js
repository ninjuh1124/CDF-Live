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


var threadNames = ['t3_9ji73y', 't3_9hkgi6'];

/**
 * polls /r/anime for new comments
 * filters out comments not in CDF threads
 * TODO: emit comment JSON to websocket **eventually**
 */
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
            'skipReplies': true,
            'limit': 500       // may or may not be too much
        });

        if (comments.length > 0) {
            latestComment = comments[0].name;
        }

        // filter to CDF comments
        await Promise.all(comments
            .filter(comment => {
                threadNames.includes(comment.link_id);
            }).map(comment => {
                comment.toJSON();
            }).map(comment => {
                // TODO: handle new comments
                console.log(JSON.stringify(comment));
            })
        );
    }
}

/*
 * checks /r/anime for a new thread every 10 minutes
 * that still might be a bit excessive
 */
async function getThreadID() {
    while (true) {
        setTimeout(() => {
            Promise.all(anime.search({
                'query': 'Casual Discussion Friday',
                'sort': 'new',
                'time': 'week'
            }).map(thread => thread.name)
              .map(name => {
                    if (!threadNames.includes(name)) {
                        threadNames.unshift(name)
                    }
              })
			)
		}, 600000);
	}
}

function main() {
    getThreadID();
	pollComments();
}

main();
