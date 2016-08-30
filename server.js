const Koa = require('koa')
const co = require('co')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const Router = require('koa-router')
const serve = require('koa-static')
const mount = require('koa-mount')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const flash = require('koa-flash')
const convert = require('koa-convert')
const helmet = require('koa-helmet')
const csrf = require('koa-csrf')
const nunjucks = require('nunjucks')
const render = require('yet-another-nunjucks-koa-render')

const http = require('http')
const IO = require('socket.io')

const env = require('./env')

const logger = require('./lib/logger')
const db = require('./lib/db')

const app = new Koa()
const server = http.createServer(app.callback())
const io = IO(server)
app.io = io
require('./lib/socket')(io)

// Adds helmet tools
app.use(convert(helmet()))

// View templates
app.use( render(nunjucks.configure('./views', {noCache:true}), {ext:'.html'}) )

// Static files
app.use(mount('/assets', serve(__dirname + '/public', {defer:false})))

// Body parser
app.use(bodyParser())

// Session and flash config
app.keys = ['keys', 'keykeys'];
app.use(convert(session({
	store: redisStore({
		host: env.redis.host,
		port: env.redis.port,
		password: env.redis.password,
		ttl: 60 * 60 * 24 * 14 * 7
	})
})))

// csrf tokens
csrf(app)

app.use(convert(flash()))

// Logs response time and status
app.use(co.wrap(function *(ctx, next) {
	const start = new Date();
	yield next();
	const ms = new Date() - start;
	logger.info(`${ctx.status} ${ctx.method} => ${ctx.url} - ${ms}ms`);
}))

// Error handler
app.use(co.wrap(function *(ctx, next) {
	try {
		yield next()
	} catch (err) {
		ctx.status = err.status || 500

		if(ctx.status === 403){
			logger.info('Forbidden:', err)
		}else if(ctx.status === 404){
			logger.info('Not found:', err)
		}else if(ctx.status === 422){
			logger.info('Validation error:', err)
		}else{
			logger.error('Invalid request:', err, ctx.request.headers)
			ctx.app.emit('error', err, ctx)
		}

		// json
		if (ctx.request.headers['content-type'] === 'application/json') {
			ctx.body = { error: err.message }
			return
		}

		// html
		if (process.env.NODE_ENV === 'production') {
			ctx.body = yield ctx.render('public/errors', {
				status: ctx.status
			})
		} else {
			ctx.body = err.stack
		}
	}

	// Unhandle 404
	if(ctx.status === 404){
		if (process.env.NODE_ENV === 'production') {
			ctx.status = 404
			ctx.body = yield ctx.render('public/errors', {
				status: ctx.status
			})
		} else {
			ctx.status = 404
			ctx.body = 'Not found'
		}
	}
}))

// Loads app routers
const mainRouter = Router()

const appRouter = require('./routers/app')
mainRouter.use('', appRouter.routes(), appRouter.allowedMethods())

const publicRouter = require('./routers/public')
mainRouter.use('', publicRouter.routes(), publicRouter.allowedMethods())

const apiRouter = require('./routers/api')
mainRouter.use('', apiRouter.routes(), apiRouter.allowedMethods())

app.use(mainRouter.routes())
	.use(mainRouter.allowedMethods())

module.exports = server