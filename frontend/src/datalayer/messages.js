const Backbone = require('backbone')

const Model = Backbone.Model.extend({
	urlRoot : '/api/v1/messages',
	idAttribute: 'uuid'
})

const Collection = Backbone.Collection.extend({
	model: Model,
	url: '/api/v1/messages'
})

module.exports = {
	Model,
	Collection
}