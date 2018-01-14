//==============
// DEPENDENCIES
//==============
var Campground = require('../models/campground'),
    User       = require('../models/user'),
    passport   = require('passport'),
    express = require('express'),
    router = express.Router();

//============
// ROOT ROUTE
//============
// LANDING
router.get('/', function(req, res) {
  res.render('landing');
});

//======================
// AUTHORISATION ROUTES
//======================
// SHOW SIGN UP FORM
router.get('/register', function(req, res) {
  res.render('register', {page: 'register'});
});

// HANDLE SIGN UP LOGIC
router.post('/register', function(req, res) {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  // eval(require('locus'))
  if(req.body.adminCode === '999bonobo333') {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user) {
    if(err){
      console.log(err);
      return res.render("register", {error: err.message});
    } else {
      passport.authenticate('local')(req, res, function() {
        req.flash('success', 'Welcome to YelpCamp, ' + user.username + '!');
        res.redirect('/campgrounds');
      });
    }
  });
});

// SHOW LOGIN PAGE
router.get('/login', function(req, res) {
  res.render('login', {page: 'login'});
});

// HANDLE LOGIN LOGIC
router.post('/login', function (req, res) {
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Great day for camping, eh, ' + req.body.username + '?'
  })(req, res); // closures, baby, wahooo
});

// LOGOUT - CREATE A CLOSURE
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/campgrounds');
});

// USER PROFILES
router.get('/users/:id', function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash('error', err);
      res.redirect('/');
    }
    // eval(require('locus'))
    Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
      if(err) {
        req.flash('error', err);
        res.redirect('/');
      }
      res.render('users/show', {user: foundUser, campgrounds: campgrounds});
    });
  });
});

module.exports = router;





