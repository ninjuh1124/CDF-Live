import axios from 'axios';

const uri = process.env.REDDIT_SERVICE_URI;

export const getUser = async (accessToken: string): Promise<{ name: string }> => {
	try {
		const user = await axios.get(
			`${uri}/user.json`,
			{ params: { accessToken } }
		);
		if (user.data.error === null) return user.data.message;
		else if (user.data.error !== null) throw new Error(user.data.error);
		else throw new Error('UserNotRetrieved');
	} catch (err) {
		throw err;
	}
};