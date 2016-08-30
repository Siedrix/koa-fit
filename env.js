const fs = require('fs')

var conf
if (process.env.NODE_ENV === 'production') {
	conf = fs.readFileSync('./config/production.json', 'utf8')
} else {
	conf = fs.readFileSync('./config/development.json', 'utf8')
}

conf = JSON.parse(conf)

conf.env = process.env.NODE_ENV
module.exports = conf
