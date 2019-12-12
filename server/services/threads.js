module.exports = db => ({
	thread: () => {
		return db.collection('threads')
			.find({})
			.sort({ _id: -1 })
			.limit(1)
			.toArray()
			.then(arr => arr[0]);
	}
});
