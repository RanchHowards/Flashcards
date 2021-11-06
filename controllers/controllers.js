const User = require('../models/user'),
  csvtojson = require('csvtojson')

module.exports.index = (req, res) => {
  res.render('landing')
}

module.exports.showLogin = (req, res) => {
  res.render('login')
}

module.exports.postLogin = (req, res) => {
  //don't need to add catch here because the middleware is only letting successful attempts through
  const url = req.session.returnTo || '/flashcard'
  delete req.session.returnTo
  res.redirect(url)
}

module.exports.createUser = async (req, res) => {
  //validateRegistration is server side validation from JOI
  const { email, username, password } = req.body
  const user = new User({ email, username })
  const registeredUser = await User.register(user, password)
  req.login(registeredUser, (err) => {
    if (err) {
      return console.log(err)
    }
  })
  req.flash('success', `Welcome, ${registeredUser.username}`)
  res.redirect('/flashcard')
}
module.exports.logout = (req, res) => {
  req.logout()

  req.flash('success', "you've been logged out")
  res.redirect('/')
}
module.exports.register = (req, res) => {
  res.render('register')
}
module.exports.addCards = (req, res) => {
  res.render('addCards')
}
module.exports.flashcard = (req, res) => {
  //don't need this middleware here, just trying it out
  res.render('flashcard')
}
module.exports.showEditCards = async (req, res, next) => {
  const data = await User.findById(currentUser._id) //req.user._id
  if (!data) {
    throw new AppError('Cards not found', 404) //if we weren't throwing it to next, we'd return & pass it to next so doesn't execut the last line in the route
    //must handle errors in all async functions
  }
  res.render('editCards', { data: data })
}

module.exports.putEditCards = async (req, res) => {
  let { oldPath, newPath, newValue, deleteCard } = await req.body
  console.table([oldPath, newPath, newValue, deleteCard])
  if (deleteCard) {
    User.updateOne(
      { _id: req.user._id },
      {
        $unset: { [oldPath]: '' },
      },
      { new: true },
      function (err, update) {
        if (err) {
          console.log(err.message)
          req.flash(err.message)
        } else {
          console.log('UNSET: ', update)
        }
      }
    )
  } else if (oldPath === newPath) {
    User.updateOne(
      { _id: req.user._id },
      { $set: { [oldPath]: newValue } },
      { new: true },
      function (err, update) {
        if (err) {
          console.log(err.message)
          req.flash(err.message)
        }
      }
    )
  } else {
    User.updateOne(
      { _id: req.user._id },
      {
        $unset: { [oldPath]: '' },
        $set: { [newPath]: newValue },
      },
      { new: true },
      function (err, update) {
        if (err) {
          console.log(err.message)
          req.flash(err.message)
        }
      }
    )
  }
}
module.exports.postAddCards = async (req, res, next) => {
  const jsonArray = await csvtojson().fromFile(req.file.path)

  let newObj = jsonArray.reduce((acc, next) => {
    let { front, back } = next
    acc[front] = back
    return acc
  }, {})
  User.findByIdAndUpdate(
    currentUser._id,
    { 'words.new': newObj },
    { new: true },
    (err, update) => {
      if (err) {
        console.log(err.message)
        res.redirect('/addcards')
      } else {
        req.flash('success', `You added ${jsonArray.length} new cards!`)
        res.redirect('/flashcard')
      }
    }
  )
}

module.exports.getApi = async (req, res) => {
  const data = await User.findById(req.user._id)
  if (!data) {
    throw new AppError('User data not found', 404)
  }
  res.send(data)
}
module.exports.createApi = (req, res) => {
  res.redirect('/flashcard')
}
module.exports.putApi = async (req, res) => {
  const { decks: updatedDeck, id, firstRound, session } = await req.body
  console.log(updatedDeck)
  User.updateOne(
    { _id: id },
    { words: updatedDeck, firstRound: firstRound, session: session },
    { new: true },
    function (err, update) {
      if (err) {
        console.log(err)
      } else {
        console.log('saved to DB')
        res.render('flashcard')
      }
    }
  )
}

module.exports.test = (req, res) => {
  res.render('test')
}
