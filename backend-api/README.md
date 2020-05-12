# Casual Discussion Friday - Back End

### Routes

***

```/v1/```

* ```history.json``` - gets all comments according to query parameters ```olderthan```, ```newerthan```, ```count```.
* ```commenttree.json``` - gets comments older than the nth top-level comment (default 50).
* ```thread.json``` - gets the latest thread
* ```comment.json``` - gets a specific comment by id
* ```token.json``` - gets new access token and/or refresh token on behalf of the user

```/content/``` - static, see folder

