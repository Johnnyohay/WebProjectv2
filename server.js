const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env' })

const express = require('express')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const MongoDB = require('./public/js/db')
const initializePassport = require('./public/js/passport_config')


const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000
app.use(
	bodyParser.urlencoded({
	extended: false,
	})
)
app.use(flash())
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
)
app.use(passport.initialize())
app.use(passport.session())
//Server Listens on port 3000
app.listen(PORT, () => {console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`)})



initializePassport(passport)





// ------------------------------------------------------------------------
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/html/login_register.html')
	//res.render('/public/html/login_register.html', {ae: 'heloooo'})
})
app.get('/signupPage.html', (req, res) => {
	res.sendFile(__dirname + '/public/html/signupPage.html')
})

app.post('/signup', async (req, res) => {
	// test to return an error
	// res.send({
	// 	error: 'ERROR MSG',
	// })

	try {
		var username = req.body.username
		var password = req.body.password
		console.log('username:', username);
		console.log('password:', password);
		(async () => {
			var myobj = { username: username, password: password };
			const result = await MongoDB.createUser(myobj.username,myobj.password)
			return result
		  })()
	} catch (e) {
		throw e
	}
	return res.redirect('/')
})

app.post(
	'/login',
	checkNotAuthenticated,
	passport.authenticate('local', {
		successRedirect: '/homePage',
		failureRedirect: '/login',
		failureFlash: true,
	})
)

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}

	res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	next()
}
















