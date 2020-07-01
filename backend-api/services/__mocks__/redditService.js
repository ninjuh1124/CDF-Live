module.exports = ({
	getToken: async ({ code, refreshToken }) => {
		if (code) return { access_token: 'foo', refresh_token: 'bar' };
		else if (refreshToken) return { access_token: 'foo' };
		else throw new Error('NoAuthorization')
	}
});