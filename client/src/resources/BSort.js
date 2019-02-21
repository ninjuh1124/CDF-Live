// sorts array descending by property
// this is the first time I've ever had to write one myself
const BSort = (arr, property) => {
	let loop;
	do {
		let arrMap = arr.map(element => element[property]);	// map by properties
		loop = false;
		for (let i=1; i<arr.length; i++) {
			if (arrMap[i-1] < arrMap[i]) {
				[arr[i-1], arr[i]] = [arr[i], arr[i-1]];
				[arrMap[i-1], arrMap[i]] = [arrMap[i], arrMap[i-1]];
				loop = true;
			}
		}
	} while (loop)
	return arr;
}

export default BSort;
