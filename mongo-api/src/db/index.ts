import * as mongoose from 'mongoose';
import { commentSchema } from './schemas/comment';
import { threadSchema } from './schemas/thread';
import { Comment } from '../models/comment.model';
import { Thread } from '../models/thread.model';

const uri = process.env.DB_CONNECTION_URI;

mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'Console error: '));
mongoose.connection.once('open', () => {
	console.log('Database connected');
});

const CommentModel = mongoose.model('Comment', commentSchema);
const ThreadModel = mongoose.model('Thread', threadSchema);

export const getComments = CommentModel.find;
export const getComment = CommentModel.findOne;
export const getThreads = ThreadModel.find;
export const insertComments = (
	comments: Comment[],
	callback: (err: any, message?: string) => void
) => {
	comments.forEach((comment: Comment) => {
		let c = new CommentModel(comment);
		c.save({}, (err: any) => {
			if (err) callback(err, c._id);
		});
		callback(null, 'success');
	});
};
export const insertThread = (
	thread: Thread,
	callback: (err: any, product: mongoose.Document) => void
) => {
	let t = new ThreadModel(thread);
	t.save({}, callback);
};
export const deleteComment = CommentModel.deleteOne;
export const editComment = CommentModel.updateOne;
export const deleteThread = ThreadModel.deleteOne;