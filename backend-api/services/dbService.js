const axios = require('axios');

const uri = process.env.DB_SERVICE_URI

module.exports = ({
	history: async query => {
		let history = [];
		try {
			history = await axios.get(
				`${uri}/v1/history.json`,
				{
					crossdomain: true,
					params: { ...query }
				}
			);
			return history.data.message;
		} catch (err) {
			throw err;
		}
	},

	thread: async () => {
		let thread = {};
		try {
			thread = await axios.get(
				`${uri}/v1/thread.json`,
				{ crossdomain: true }
			);
			return thread.data.message;
		} catch (err) {
			throw err;
		}
	},

	comment: async query => {
		let comment = {};
		try {
			comment = await axios.get(
				`${uri}/comment.json`,
				{
					crossdomain: true,
					params: { ...query }
				}
			)
				.then(res => res.data.message)
				.catch(err => {
					console.error(err)
				});
		} catch (err) {
			throw err;
		}
	}
});
