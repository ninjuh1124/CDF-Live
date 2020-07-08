import * as express from 'express';
import * as db from '../db';
import { MongooseDocument } from 'mongoose';
import { Comment } from '../models/comment.model';
import { Thread } from '../models/thread.model';
import { getUser } from '../services/reddit';

export const send = (res: express.Response, err: any, d?: any): void => {
	let code;
	let data;
	if (err) {
		code = err.code ? err.code : 500;
		data = err.message ? err.message : 'InternalError';
	} else {
		code = 200;
		data = d ? d : null;
	}

	res.status(code).json({ error: err, message: data });
}

export const refreshHistory = (
	newerThan: string | null,
	callback: (err: Error | null, arr: MongooseDocument[]) => void
): void => {
	db.getComments(
		{ _id: { $gt: newerThan } },
		null,
		{ sort: { _id: -1 } },
		callback
	);
};

export const generateHistory = (
	query: { olderThan: string | null, count: number | null } = { olderThan: null, count: 50 },
	callback: (err: any, arr: MongooseDocument[]) => void
): void => {

	db.getComments(
		// filter out children comments
		{
			parentID: /^t3_\S+$/,
			_id: query.olderThan ? { $lt: query.olderThan } : /^t1_\S+$/
		},

		// only retrieve _id field
		'_id',

		// get {count}th document
		{
			sort: { _id: -1 },
			limit: 1,
			skip: query.count
		},

		// get all documents younger than {count}th document
		(err: any, id: MongooseDocument[]) => {
			db.getComments(
				{
					$and: [
						{ _id: { $gte: id[0] } },
						{
							_id: query.olderThan ?
								{ $lt: query.olderThan } :
								/^t1_\S+$/
						}
					]
				},
				null,
				{ sort: { _id: -1 } },
				callback
			);
		}
	);
};

export const getComment = (
	query: { id?: string, _id?: string },
	callback: (err: any, arr: MongooseDocument) => void
): void => { db.getComment(query, null, null, callback); };

export const getThread = (callback: (err: any, arr: MongooseDocument[]) => void) => {
	db.getThreads(null, null, { sort: { _id: -1 }, limit: 1 }, callback);
};

export const insertComments = (
	comments: Comment[],
	callback: (err: any, message: string) => void
): void => {
	db.insertComments(comments, callback);
}

export const insertThread = (thread: Thread, callback) => {
	db.insertThread(thread, callback);
};

export const deleteComment = (
	query: { _id: string },
	callback: (err: any) => void
): void => {
	db.deleteComment(query, callback);
}

export const editComment = (
	query: { _id: string, body: string },
	callback: (err: any, message: string) => void
): void => {
	db.editComment({ _id: query._id }, { body: query.body }, callback);
}

export const verify = async (
	{ _id, accessToken }: { _id: string, accessToken: string }
): Promise<boolean> => {
	const [rUser, dUser] = await Promise.all([
		// user according to reddit
		getUser(accessToken)
			.then(user => <string>user.name),
		// user according to db
		db.getComment({ _id: _id })
			.exec()
			.then(doc => doc.get('author', String))
	]);

	return (rUser === dUser);
};