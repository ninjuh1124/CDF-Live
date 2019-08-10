# v2.2.1 - 8/9/19

* Moved Editor below reddit buttons row
* Editor now focuses when didMount

# v2.~~1~~2.0 - 8/8/19

Lotta stuff happened, and I've been writing code for months on this one. 2.1 was adding in OAuth, 2.2 is implementing Redux to keep my OAuth code sane. I might add some small things here and there, but I think I'm going to move onto a new project for the time being

**Frontent**

* Moved data to Redux store (now integrated)
* Implemented reddit login
* Implemented reddit API routes: comment, edit, delete, save
* Implemented own API routes: edit, delete
* Moved Spoilers and CommentFaces to own component handlers
* Moved all logic to container components and all rendering to component components
* Added proper renderers to ReactMarkdown parser
* Moved from CSS to Sass
* Some styling fixes
* Comments animate in
* Highlighting on own comments
* Refactoring
* Probably some other stuff I forgot in the several months I updated this

**Backend**

* Added new route for tokens
* Database connection pooling
* Upserting
* Added ~~CR~~UD routes to db

# v2.0.1 - 7/6/19

* Stopped doing things dangerously
* Fixed bug with database not updating properly

# v2.0.0 - 28/2/19

* Added Changelog
* Relaunched on new host
* Split front end from back end

### Front End

* Closed websocket
* Rewrote in React.js
* Wrote Dark Theme CSS
* Added 404 page

### Back End

* Closed websocket
* Depracated server-side page generation
* Dedicated process for listening to Reddit API
* Restructured routing
* Separated route controllers
* Added new API routes for parent history and comment tree
* Addeed new API routes for static content
