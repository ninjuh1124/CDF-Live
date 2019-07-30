module.exports = (db) => {
	return {
		loadThreads: callback => {
			db.collection('threads')
				.find({ kind: 'submission' })
				.toArray( (err, arr) => {
					callback(null, arr);
				});
		},

		isNewCDF: obj => {
			obj = obj.toJSON();
			return (
				obj.author_fullname == 't2_6wrl6'
				&& obj.title.includes("Casual Discussion Friday")
			);
		},

		handleThread: thread => {
			obj = thread.toJSON();
			return {
				kind:		'submission',
				_id:		obj.name,
				id: 		obj.id,
				permalink: 	'https://redd.it/' + obj.id
			};
		},

		handleComment: comment => {
			obj = obj.toJSON();
			return {
				kind: 		'comment',
				author: 	obj.author,
				_id: 		obj.name,
				id: 		obj.id,
				created: 	obj.created_utc,
				permalink: 	'https://reddit.com' + obj.permalink,
				parentID: 	obj.parent_id,
				body: 		obj.body
			};
		},

		store: obj => {
			let collection;
			if (obj.kind === 'comment') collection = 'comments';
			else if (obj.kind === 'submission') collection = 'threads';

			db.collection(collection)
				.insertOne(obj);
		}
	}
}
