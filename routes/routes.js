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
    { registrationSchema } = require('../schemas/schemas');

const jsonParser = bodyParser.json()  //using this as a test for the csv file upload, BodyParser, the express standard for parsing incoming data, cannot be used to parse multipart/form-data
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const validateRegistration = (req, res, next) => { //serverside validation with Joi
    const { error } = registrationSchema.validate(req.body);
    if (error) {
        throw new AppError(error.message, 400)
    }
    next()
};

router.get('/', controller.index)

router.route('/login')
    .get(controller.showLogin)
    .post(urlencodedParser, jsonParser, passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), controller.postLogin)

router.get('/logout', controller.logout)

router.route('/register')
    .get(controller.register)
    .post(urlencodedParser, jsonParser, validateRegistration, wrapAsync(controller.createUser))

router.get('/addcards', controller.addCards)
router.post('/addcards', upload.single('spreadsheet'), controller.postAddCards)

router.route('/editcards')
    .get(wrapAsync(controller.showEditCards))
    .put(urlencodedParser, jsonParser, wrapAsync(controller.putEditCards))
    .delete(wrapAsync(controller.deleteEditCards))


router.get('/flashcard', isLoggedIn, controller.flashcard)

router.route('/api')
    .get(wrapAsync(controller.getApi))
    .post(controller.createApi)
    .put(urlencodedParser, jsonParser, wrapAsync(controller.putApi))
// router.put('/addcards/editfront', urlencodedParser, jsonParser, wrapAsync(async (req, res) => {
// 	const { oldName, newName } = await req.body;
// 	User.updateOne({ _id: req.user._id }, { $rename: { [oldName]: newName } }, { new: true, upsert: true }, function (err, update) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log(update, 'saved to DB')
// 			res.render('flashcard');
// 		}
// 	})

// }))

// router.put('/addcards/editback', urlencodedParser, jsonParser, wrapAsync(async (req, res) => {
// 	const { nestedPath, newName } = await req.body;
// 	User.updateOne({ _id: req.user._id }, { $set: { [nestedPath]: newName } }, { new: true, upsert: true }, function (err, update) {  //must put VARIABLES AS KEYS in brackets (not 100% sure) - this also took some time to figure out
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log(update, 'saved to DB')
// 			res.render('flashcard');
// 		}
// 	})

// }))
router.all('*', (req, res, next) => { //use get to capture all missed routes
    next(new AppError('WHERE AM I????', 404))
})

module.exports = router;