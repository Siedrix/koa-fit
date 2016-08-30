const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4
const _ = require('underscore')

const UserSchema = new Schema({
	name: {type:String, required: true},
	email: {type:String, required: true},
	uuid: {type: String, default: v4},
	password: {type: String},
	apiKey: {type: String},
	apiToken: {type: String}
})

UserSchema.pre('save', function (next) {
	if (!this.apiKey) {this.apiKey = v4()}
	if (!this.apiToken) {this.apiToken = v4()}

	next()
})

UserSchema.methods.toJSON = function() {
	var obj = this.toObject()
	delete obj.password
	delete obj.apiKey
	delete obj.apiToken
	return obj
}

const User = db.model('User', UserSchema)

module.exports = User
