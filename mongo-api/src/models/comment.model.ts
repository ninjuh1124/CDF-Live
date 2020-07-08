export interface Comment {
	_id: string,
	id: string,
	kind: string,
	thread: string,
	author: string,
	created: number,
	permalink: string,
	parentID: string,
	body: string
}