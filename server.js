var snoowrap = require('snoowrap'),
	express = require('express'),
	dotenv = require('dotenv');

dotenv.load();

// reddit object
const anime = new snoowrap({
	userAgent: process.env.USER_AGENT,
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD
}).getSubreddit('anime');

async function getCDF() {
    let currentThread;

    while (true) {
        listing = await anime.search(
        	{ 'query': 'Casual discussion friday',
        	  'sort': 'new',
        	  'time': 'week',
              'before': currentThread }
        );

        // check if new thread
        if (listing.length > 0) {
            currentThread = listing[0];
            console.log("New thread hype!");
        }

        console.log(currentThread.name);

        // get new comments
        while (!(currenThread.refresh().locked)){
            
        }
    }
}
