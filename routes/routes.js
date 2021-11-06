const express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  wrapAsync = require('../utils/wrapAsync'),
  multer = require('multer'),
  upload = multer({ dest: 'uploads/' }),
  { isLoggedIn } = require('../middleware'),
  AppError = require('../utils/appError'),
  controller = require('../controllers/controllers'),
  { registrationSchema } = require('../schemas/schemas')

const jsonParser = bodyParser.json() //using this as a test for the csv file upload, BodyParser, the express standard for parsing incoming data, cannot be used to parse multipart/form-data
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const validateRegistration = (req, res, next) => {
  //serverside validation with Joi
  const { error } = registrationSchema.validate(req.body)
  if (error) {
    throw new AppError(error.message, 400)
  }
  next()
}

router.get('/', controller.index)

router
  .route('/login')
  .get(controller.showLogin)
  .post(
    urlencodedParser,
    jsonParser,
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/',
    }),
    controller.postLogin
  )

router.get('/logout', controller.logout)

router
  .route('/register')
  .get(controller.register)
  .post(
    urlencodedParser,
    jsonParser,
    validateRegistration,
    wrapAsync(controller.createUser)
  )

router.get('/addcards', isLoggedIn, controller.addCards)
router.post(
  '/addcards',
  isLoggedIn,
  upload.single('spreadsheet'),
  controller.postAddCards
)

router
  .route('/editcards')
  .get(isLoggedIn, wrapAsync(controller.showEditCards))
  .put(
    isLoggedIn,
    urlencodedParser,
    jsonParser,
    wrapAsync(controller.putEditCards)
  )
  .delete(isLoggedIn, wrapAsync(controller.deleteEditCards))

router.get('/flashcard', isLoggedIn, controller.flashcard)

router
  .route('/api')
  .get(isLoggedIn, wrapAsync(controller.getApi))
  .post(isLoggedIn, controller.createApi)
  .put(isLoggedIn, urlencodedParser, jsonParser, wrapAsync(controller.putApi))

router.route('/test').get(controller.test)

router.all('*', (req, res, next) => {
  //use get to capture all missed routes
  next(new AppError('WHERE AM I????', 404))
})

module.exports = router
