const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4

const PostSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User' },
	uuid: {type: String, default: v4},
	subreddit: String,
	title: String,
	url: String
})

const Post = db.model('Post', PostSchema)

module.exports = Post
