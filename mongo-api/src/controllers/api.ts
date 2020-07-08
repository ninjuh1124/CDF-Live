import * as express from 'express';
import {
	refreshHistory, send, generateHistory, getThread, insertThread, verify, editComment, deleteComment
} from './utils';
import { getComment, insertComments } from '../db';

export const apiController = ({
	/**
	 * sends flat array of comments to user
	 * if @newerThan is provided, will only send comments newer than supplied id
	 * if @olderThan is provided, will send @count parents and all associated children
	 */
	history: (req: express.Request, res: express.Response): void => {
		if (req.query.newerThan) {
			refreshHistory(
				<string>req.query.newerThan,
				(err, arr) => {
					send(res, err, arr);
				}
			);
		} else {
			generateHistory(
				{
					olderThan: <string>req.query.olderThan,
					count: parseInt(<string>req.query.count)
				},
				(err, arr) => { send(res, err, arr); }
			);
		}
	},

	/**
	 * sends comment with requested @_id
	 */
	getComment: (req: express.Request, res: express.Response): void => {
		getComment(<{ id?: string, _id?: string }>req.query, (err, comment) => {
			send(res, err, comment);
		});
	},

	/**
	 * sends latest thread id
	 */
	getThread: (req: express.Request, res: express.Response): void => {
		getThread((err, threads) => { send(res, err, threads); });
	},

	/**
	 * inserts supplied comments to database
	 * http request must have proper authorization header
	 */
	insertComments: (req: express.Request, res: express.Response): void => {
		if (req.headers.authorization === process.env.REDDIT_CLIENT_SECRET) {
			insertComments(
				req.body.comments,
				(err: any, data: any) => {
					send(res, err, data);
				}
			);
		} else {
			send(res, { code: 400, message: 'Unauthorized' });
		}
	},

	/**
	 * inserts supplied thread to database
	 * http request must have proper authorization header
	 */
	insertThread: (req: express.Request, res: express.Response): void => {
		if (req.headers.authorization === process.env.REDDIT_CLIENT_SECRET) {
			insertThread(
				req.body.thread,
				(err: any, data: any) => {
					send(res, err, data);
				}
			);
		} else {
			send(res, { code: 400, message: 'Unauthorized' });
		}
	},

	/**
	 * verifies ownership of comment and deletes comment
	 */
	deleteComment: async (req: express.Request, res: express.Response): Promise<void> => {
		if (await verify({ _id: req.body._id, accessToken: req.body.accessToken })) {
			deleteComment(<{ _id: string }>req.body, (err: any) => {
				send(res, null, 'success');
			});
		} else {
			send(res, { code: 400, message: 'Unauthorized' });
		}
	},

	/**
	 * verifies ownership of comment and edits comment
	 */
	editComment: async (req: express.Request, res: express.Response): Promise<void> => {
		if (await verify({ _id: req.body._id, accessToken: req.body.accessToken })) {
			editComment(<{ _id: string, body: string }>req.body, (err, message) => {
				send(res, null, 'success');
			});
		} else {
			send(res, { code: 400, message: 'Unauthorized' });
		}
	},

	/**
	 * not currently in use
	 */
	deleteThread: (req: express.Request, res: express.Response): void => {

	}
});