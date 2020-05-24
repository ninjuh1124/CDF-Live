const generateString = () => {
	let str = "";
	let chars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
	for (let i=1; i<40; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
};

export default generateStr;
