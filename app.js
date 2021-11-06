if (process.env.NODE_ENV !== 'production') {
  // this pulls our environmental variables from the .env file while still in production
  require('dotenv').config() // would want to ignore this file when uploading to GitHub
}

const { valid } = require('joi')

const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  session = require('express-session'),
  methodOverride = require('method-override'), ///TRY THIS OUT FOR THE EDIT FORM!!!!
  ejsMate = require('ejs-mate'),
  flash = require('connect-flash'),
  path = require('path'),
  // wrapAsync = require('./utils/wrapAsync'),
  // seedDB = require('./seed'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user'),
  routes = require('./routes/routes')

// var	todoRoutes = require('./Routes/todos');

//seedDB(); //seed DB
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/flashcards'

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connected to DB!!!')
  })
  .catch((err) => {
    console.log('ERROR:', err.message)
  })

//APP CONFIG
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
// app.use(bodyParser.urlencoded({extended: true}));

// app.use(expressSanitzer());
app.use(methodOverride('_method'))
// app.use(bodyParser.json()); //parses json data for req.body
app.use(express.static(__dirname + '/views'))
app.use(express.static(path.join(__dirname, '/public'))) //__dirname is used incase this file is executed from a different computer & files are located elswewhere

const sessionConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //added layer of security
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //Date.now() gives date in miliseconds, the numbers to the right make it a week later
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', routes)

app.use((err, req, res, next) => {
  const { status = 500 } = err
  if (!err.message) err.message = 'something went wrong!!!!!!!'
  res.status(status).render('error', { err })
})
app.listen(port, () => {
  console.log('bloRRRRp')
})
