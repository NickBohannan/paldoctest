const passwordValidator = require('password-validator')

let schema = new passwordValidator()

schema
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().symbols()

module.exports = schema