const Router = require('koa-router')
const co = require('co')

const bcryptUtils = require('../lib/bcrypt')

const User = require('../models/user')
const Device = require('../models/device')
const Metrics = require('../models/metric')

const appRouter = Router({
	prefix: '/app'
})

appRouter.use(co.wrap(function *(ctx, next) {
	var user
	if(ctx.session.userUuid){
		user = yield User.findOne({uuid: ctx.session.userUuid})

		ctx.state.user = user
	} 

	if(user){
		yield next()
	} else {
		return ctx.redirect('/log-in')
	}
}))

appRouter.get('/', co.wrap(function *(ctx, next) {
	yield ctx.render('app/main',{})
}))

appRouter.get('/device/:uuid', co.wrap(function *(ctx, next) {
	const device = yield Device.findOne({uuid:ctx.params.uuid})
	if(!device){
		ctx.throw(404)
	}

	const metric = yield Metrics.findOne({device: device}, {}, { sort: { 'date' : -1 } })

	yield ctx.render('app/device',{device, metric})
}))

appRouter.get('/profile', co.wrap(function *(ctx, next) {
	const devices = yield Device.find({user:ctx.state.user})

	yield ctx.render('app/profile',{devices})
}))

appRouter.post('/device', co.wrap(function *(ctx, next){
	const body = ctx.request.body

	const device = yield Device.create({
		name: body.device,
		user: ctx.state.user
	})

	ctx.body = device
}))

module.exports = appRouter