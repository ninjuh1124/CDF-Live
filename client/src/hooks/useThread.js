import { useState, useEffect } from 'react';
import { getThread } from '../utils/appAPI';

const useThread = () => {
	const [thread, setThread] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		getThread()
			.then(thread => {
				setThread(thread);
			})
			.catch(error => {
				setError(error);
			});

	},[thread])

	return { ...thread, error };
}

export default useThread;
