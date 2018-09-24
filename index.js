var {PythonShell} = require('python-shell');
let py = new PythonShell(
	'fetchThread.py', 
	{ mode: 'text' });

py.on('comment', comment => {
	console.log(comment);
});
