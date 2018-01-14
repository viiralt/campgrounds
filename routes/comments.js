//==============
// DEPENDENCIES
//==============
var Campground = require('../models/campground'),
    middleware = require('../middleware/index'),
    Comment    = require('../models/comment'),
    express    = require('express'),
    router     = express.Router({mergeParams: true});

//=================
// COMMENTS ROUTES
//=================
// NEW COMMENT FORM
router.get('/new', middleware.checkLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground}); // associate comment with id
    }
  });
});

// CREATE NEW COMMENT
router.post('/', middleware.checkLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
     console.log(err);
     res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if(err)  {
          req.flash('Something went wrong');
          console.log(err);
           } else {
             // add username and id to comment
             comment.author.id = req.user._id;
             comment.author.username = req.user.username;
             // save comment
             comment.save();
             campground.comments.push(comment._id);
             // campground.comments.push(comment);
             campground.save();
             req.flash('success', 'New comment created');
             res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// EDIT SELECTED COMMENT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err || !foundCampground) {
      req.flash('error', 'Campground not found');
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err || !foundComment) {
        res.redirect('back');
      } else {
        res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
      }
    });
  });
});

// UPDATE SELECTED COMMENT
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if(err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment updated');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DESTROY SELECTED COMMENT
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if(err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

module.exports = router;