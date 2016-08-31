const Router = require('koa-router')
const co = require('co')
const bcryptUtils = require('../lib/bcrypt')

const User = require('../models/user')
const Device = require('../models/device')
const Metric = require('../models/metric')
const Message = require('../models/message')

const apiRouter = Router({
	prefix: '/api/v1'
})

apiRouter.use(co.wrap(function *(ctx, next) {
	var device, user

	if (ctx.request.headers.authorization) {
		const authorizationHeader = ctx.request.headers.authorization.split(' ')

		if (authorizationHeader.length === 2 && authorizationHeader[0] === 'DeviceKey') {
			const keys = authorizationHeader[1].split(':')

			device = yield Device.findOne({apiKey: keys[0], apiToken: keys[1]}).populate('user')
			user = device.user
		}
	}

	if(ctx.session.userUuid){
		user = yield User.findOne({uuid: ctx.session.userUuid})

		ctx.state.user = user
	}

	if(user){
		ctx.state.device = device
		ctx.state.user = user

		yield next()
	}else{
		ctx.throw(403)
	}
}))

apiRouter.post('/metrics', co.wrap(function *(ctx, next) {
	const device = ctx.state.device
	const metric = yield Metric.create({
		device,
		data: ctx.request.body
	})

	ctx.app.io.to(device.apiKey+':'+device.apiToken).emit('metric', metric.toJSON() )
	
	ctx.body = {success: true}
}))

apiRouter.get('/messages',co.wrap(function *(ctx, next) {
	const messages = yield Message.find({}).sort('date').populate('user', 'name')
		
	ctx.body = messages
}))

apiRouter.post('/messages',co.wrap(function *(ctx, next) {
	const user = ctx.state.user
	const message = yield Message.create({
		user,
		message: ctx.request.body.message
	})

	ctx.app.io.emit('new-message', message )
		
	ctx.body = {success: true}
}))

module.exports = apiRouter