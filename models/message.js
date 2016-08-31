const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4
const _ = require('underscore')

const MessageSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	message: String,
	date: { type: Date, default: Date.now }
})

const Message = db.model('Message', MessageSchema)

module.exports = Message