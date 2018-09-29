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

reddit.config({
    'debug': true
});

// threads names included here to help the program along
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

    let latestComment = null;
    let comments = [];

    while (true) {
        // retrieve new comments from subreddit
        if (latestComment != null) {
            comments = await anime.getNewComments({
                'before': latestComment,
                'skipReplies': true,
                'limit': 100       // may or may not be too much
            }).catch((err) => {
                console.log(err);
            });
        } else {
            const comments = await anime.getNewComments({
                'skipReplies': true,
                'limit': 100
            });
        }

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
                // TODO: do something with these comments
                console.log("********NEW COMMENT BY " + comment.author);
            })
        ).catch((err) => {
            console.log(err)
        });

        await new Promise(resolve => setTimeout(resolve, 10000))
    }
}

/*
 * checks /r/anime for a new thread every 10 minutes
 * that still might be a bit excessive
 */
async function getThreadID() {
    while (true) {
        // FIX: undefined is not a function
        await Promise.all(anime.search({
            'query': 'Casual Discussion Friday',
            'sort': 'new',
            'time': 'week'
        })
          .filter(thread => {
              return !threadNames.includes(thread.name)
          }).map(name => {
                threadNames.unshift(name);
          })
      ).catch((err) => {
          console.log(err)
      });

        await new Promise(resolve => setTimeout(resolve, 600000));
	}
}

function main() {
    getThreadID();
	pollComments();
}

main();
