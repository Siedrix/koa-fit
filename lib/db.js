const mongoose = require('mongoose')
const env = require('../env')

const auth = env.db.user ? `${env.db.user}:${env.db.password}@` : ''
const url = `mongodb://${auth}${env.db.host}:${env.db.port}/${env.db.name}`

mongoose.Promise = global.Promise
console.log('connecting to:', url)
const connection = mongoose.connect(url)

module.exports = mongoose

