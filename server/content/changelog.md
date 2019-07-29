# v2.~~1~~2.0

Lotta stuff happened, and I've been writing code for months on this one. 2.1 was adding in OAuth, 2.2 is implementing Redux to keep my OAuth code sane.

**Frontent**

* Moved data to Redux store (now integrated)
* Implemented reddit login
* Implemented reddit API routes: comment, edit, delete, save
* Minor restyling
* Restructured files
* Probably some other stuff I forgot in the several months I updated this

**Backend**

* Added new route for tokens
* Database connection pooling (why didn't anyone tell me about this earlier?)
* 

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
