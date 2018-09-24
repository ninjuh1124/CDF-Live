import time, sys, praw
from dotenv import load_dotenv
load_dotenv()

# create /r/anime object
reddit = praw.Reddit('watcher', user_agent='cdf watcher')
anime = reddit.subreddit('anime')


# fetch thread
def getThread(subreddit, title):
	thread = subreddit.search(title, sort='new', limit=1).next()
	thread.comment_sort = 'new'
	return thread

# fetch latest comments and prints as json string
def getComment(thread, index):
	comment = thread.comments.__getitem__(index)
	author = comment.author.name
	body = repr(comment.body)
	id = comment.id
	linkId = comment.link_id
	# there's probably an easier way of doing this
	# i don't care enough to look it up
	print("{'author':'"+author+"', 'body':'"+body+"', 'id':'"+id+"', 'link_id':'"+linkId+"'}")

cdf = getThread(anime, 'Casual Discussion Friday')

# initialize console with latest 10 comments
for i in range(10, 0, -1):
	getComment(cdf, i)
	sys.stdout.flush()

numComments = cdf.num_comments

while 1:
	time.sleep(10)
	cdf = getThread(anime, 'Casual Discussion Friday')
	if (cdf.num_comments > numComments):
		for i in range(0, (cdf.num_comments - numComments - 1)):
			getComment(cdf, i)
			sys.stdout.flush()
			numComments = cdf.num_comments
