//==============
// DEPENDENCIES
//==============
var Campground    = require('../models/campground'),
    middleware    = require('../middleware/index'), // if we leave it to index, instead of middleware.js, it will be obtained auto!!
    geocoder      = require('geocoder'),
    express       = require('express'),
    router        = express.Router();

//====================
// CAMPGROUNDS ROUTES
//====================
// INDEX
router.get('/', function(req, res) {
  Campground.find({}, function(err, allCampgrounds) { // look for all the campgrounds in the db
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

// ADD NEW CAMPGROUND FORM
router.get('/new', middleware.checkLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

// CREATE CAMPGROUND
router.post('/', middleware.checkLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
 };
 var cost = req.body.cost;
  //Location Code - Geocode Package
  geocoder.geocode(req.body.location, function (err, data, results, status) {
    if (err || data.status === 'ZERO_RESULTS') {
      req.flash('error', 'Invalid address, please try again');
      return res.redirect('back');
    }
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});

// SHOW SELECTED CAMPGROUND PAGE
router.get('/:id', function(req, res) {
  // find the campground with provided ID
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
    if(err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// EDIT SELECTED CAMPGROUND
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE SELECTED CAMPGROUND
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
   //Location Code - Geocode Package
  geocoder.geocode(req.body.location, function (err, data, results, status) {
    if (err || data.status === 'ZERO_RESULTS') {
      req.flash('error', 'Invalid address, try typing a new address');
      return res.redirect('back');
    }
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description,
      cost: req.body.cost, location: location, lat: lat, lng: lng};
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if(err) {
      res.redirect('/campgrounds');
    } else {
      eval(require(locus))
      req.flash('success', 'Campground updated');
      res.redirect('/campgrounds/' + req.params.id);
    }
    });
  });
});

// DESTROY SELECTED CAMPGROUND
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Campground removed');
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router; // replaced app with router, exporting router