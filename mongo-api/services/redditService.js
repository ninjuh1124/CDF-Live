const axios = require('axios');

const uri = process.env.REDDIT_SERVICE_URI;

module.exports = ({
	getUser: async (accessToken) => {
		try {
			let user = await axios.get(
				`${uri}/user.json`,
				{ params: { accessToken } }
			);
			if (!user.error) return user.message;
			else if (user.error) throw new Error(user.error.message);
			else throw new Error();
		} catch (err) {
			throw err;
		}
	}
});