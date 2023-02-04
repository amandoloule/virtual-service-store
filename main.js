'use strict'

const express = require('express'),
	app = express(),
	router = require('./routes/index'),
	layouts = require('express-ejs-layouts'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	expressSession = require('express-session'),
	cookieParser = require('cookie-parser'),
	passport = require('passport'),
	connectFlash = require('connect-flash'),
	expressValidator = require('express-validator'),
	User = require('./models/user')

// mongoose.Promise = global.Promise

mongoose.connect(
	'mongodb://localhost:27017/loulesoft',
	{ useNewUrlParser: true }
)

// eslint-disable-next-line no-undef
app.set('port', process.env.PORT || 3000)
app.set('view engine', 'ejs')

app.use(expressValidator())

app.use(
	express.urlencoded({
		extended: false
	})
)
app.use(express.json())
app.use(layouts)
app.use(express.static('public'))
app.use(
	methodOverride('_method', {
		methods: ['POST', 'GET']
	})
)

app.use(cookieParser('secretLouleSoft123'))
app.use(expressSession({
	secret: 'secretLouleSoft123',
	cookie: {
		maxAge: 4000000
	},
	resave: false,
	saveUninitialized: false
}))

app.use(connectFlash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
	res.locals.loggedIn = req.isAuthenticated()
	res.locals.currentUser = req.user
	res.locals.flashMessages = req.flash()
	next()
})

// app.get("/", (req, res) => {
//   res.send("Bem-vindo à LouleSoft")
// })

app.use('/', router)

/* app.listen(app.get('port'), () => {
	console.log(
		`Server running at http://localhost:${app.get('port')}...`
	)
}) */
const server = app.listen(app.get('port'), () => {
		console.log(`Server running at http://localhost:${app.get('port')}...`)
	}),
	io = require('socket.io')(server),
	chatController = require('./controllers/chatController')(io)
