const bcrypt = require('bcryptjs')
const thunkify = require('thunkify')

const saltRounds = 10

var bcryptUtils = {}

bcryptUtils.genSalt = thunkify(bcrypt.genSalt)
bcryptUtils.hash = thunkify(bcrypt.hash)
bcryptUtils.compare = thunkify(bcrypt.compare)
bcryptUtils.rounds = 10

module.exports = bcryptUtils