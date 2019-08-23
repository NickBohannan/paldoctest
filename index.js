require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const ejsLint = require('ejs-lint')

const routes = require('./routes/index')

const Order = require('./models/order')
const User = require('./models/user')

const app = express()

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use('/', routes)

const port = process.env.PORT || 8080

app.enable('trust proxy')
app.set('port', port)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.listen(port, () => {
    console.log('Server listening on port ' + port)
})

console.log(process.env.HOME)

Order.sync()
User.sync()

module.exports = { app, path }