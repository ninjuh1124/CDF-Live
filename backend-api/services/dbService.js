const axios = require('axios');

const uri = process.env.DB_SERVICE_URI

module.exports = ({
	history: query => {
		axios.get(`${uri}/v1/history.json`)
			.then(res => {})
			.catch(err => {
				console.error(err)
			});
	},

	thread: () => {
		axios.get(`${uri}/v1/thread.json`)
			.then(res => {})
			.catch(err => {
				console.error(err)
			});
	},

	comment: query => {
		axios.get(`${uri}/comment.json`)
			.then(res => {})
			.catch(err => {
				console.error(err)
			});
	}
});
