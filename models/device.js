const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4
const _ = require('underscore')

const DeviceSchema = new Schema({
	name: {type:String, required: true},
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	uuid: {type: String, default: v4},
	apiKey: {type: String},
	apiToken: {type: String}
})

DeviceSchema.pre('save', function (next) {
	if (!this.apiKey) {this.apiKey = v4()}
	if (!this.apiToken) {this.apiToken = v4()}

	next()
})

const Device = db.model('Device', DeviceSchema)

module.exports = Device