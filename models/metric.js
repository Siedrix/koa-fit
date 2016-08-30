const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4
const _ = require('underscore')

const MetricSchema = new Schema({
	device: { type: Schema.Types.ObjectId, ref: 'Device' },
	data: Schema.Types.Mixed,
	date: { type: Date, default: Date.now }
})

MetricSchema.post('save', function(doc) {
	console.log('%s has been saved', doc._id);
});


const Metric = db.model('Metric', MetricSchema)

module.exports = Metric