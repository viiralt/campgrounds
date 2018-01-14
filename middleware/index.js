//==============
// DEPENDENCIES
//==============
var Campground = require('../models/campground'),
    Comment    = require('../models/comment');

//=============================
// MIDDLEWARE CONFIG & METHODS
//=============================
module.exports = {
  checkLoggedIn: function(req, res, next){
    if(req.isAuthenticated()) {
      return next();
    }
      req.flash('error', 'You must be signed in to do that');
      res.redirect('/login');
  },
  checkCampgroundOwnership: function(req, res, next) {
    if(req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, campground) {
        if(campground.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
         req.flash('error', 'You don\'t have permission to do that');
         res.redirect('/campgrounds/' + req.params.id);
        }
      });
    } else {
      req.flash('error', 'You must be signed in to do that');
      res.redirect('/login');
    }
  },
  checkCommentOwnership: function(req, res, next) {
    if(req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, comment) {
        if(comment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that');
          res.redirect('/campgrounds/' + req.params.id);
        }
       });
    } else {
      req.flash('error', 'You must be signed in to do that');
      res.redirect('login');
    }
  }
};