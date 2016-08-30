const Router = require('koa-router')
const co = require('co')

const bcryptUtils = require('../lib/bcrypt')

const User = require('../models/user')

const publicRouter = Router()

publicRouter.use(co.wrap(function *(ctx, next){
	var user = yield User.findOne({uuid: ctx.session.userUuid})

	if(!user){
		yield next()
	}else{
		return ctx.redirect('/app')
	}	
}))

publicRouter.get('/', co.wrap(function *(ctx, next) {
	yield ctx.render('public/home',{title:'Welcome to Koa base'})
}))

publicRouter.get('/about', co.wrap(function *(ctx, next) {
	yield ctx.render('public/about')
}))

publicRouter.get('/log-in', co.wrap(function *(ctx, next) {
	const error = ctx.flash.error
	yield ctx.render('public/login', {error})
}))

publicRouter.post('/log-in', co.wrap(function *(ctx, next) {
	const body = ctx.request.body

	const password = ctx.request.body.password
	const user = yield User.findOne({email: ctx.request.body.email})

	if(!user){
		ctx.flash = {'error': 'Usuario o password invalido'}
		return ctx.redirect('/log-in')
	}

	const compare
	try{
		compare = yield bcryptUtils.compare(password, user.password)
	}catch(err){
		ctx.throw(500, err)
	}
	
	ctx.session.userUuid = user.uuid
	ctx.redirect('/app')
}))

publicRouter.get('/sign-up', co.wrap(function *(ctx, next) {
	const error = ctx.flash.error
	yield ctx.render('public/signup', {error})
}))

publicRouter.post('/sign-up', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	const currentUser = yield User.findOne({email: body.email})

	console.log('=>',currentUser)
	if (currentUser) {
		console.log()
		ctx.flash = {error: 'User already exists.'}
		return ctx.redirect('/sign-up')
	}

	body.password = yield bcryptUtils.hash(body.password, bcryptUtils.rounds)
	body.email = body.email.toLowerCase()

	ctx.body = body

	const newUser = yield User.create(body)
	ctx.session.userUuid = newUser.uuid
	ctx.redirect('/app')
}))

module.exports = publicRouter