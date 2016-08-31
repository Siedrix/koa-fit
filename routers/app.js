const Router = require('koa-router')
const co = require('co')

const bcryptUtils = require('../lib/bcrypt')

const User = require('../models/user')
const Device = require('../models/device')
const Metrics = require('../models/metric')
const Post = require('../models/post')

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
	const devices = yield Device.find({user:ctx.state.user})

	yield ctx.render('app/main',{devices})
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

appRouter.get('/r/:subreddit', co.wrap(function *(ctx, next){
	const posts = yield Post.find({subreddit:ctx.params.subreddit})
	// ctx.body = 'Welcome to ' + ctx.params.subreddit
	yield ctx.render('simple-views/simple-view',{
		subreddit:ctx.params.subreddit,
		posts:posts
	})
}))

appRouter.post('/r/:subreddit/posts/', co.wrap(function *(ctx, next){
	const form = ctx.request.body

	const post = yield Post.create({
		subreddit: ctx.params.subreddit,
		user: ctx.state.user,
		title: form.title,
		url: form.url
	})

	ctx.app.io.to(ctx.params.subreddit).emit('new-post', post.toJSON() )

	// ctx.body = post
	return ctx.redirect('/app/r/'+ctx.params.subreddit)
}))

module.exports = appRouter