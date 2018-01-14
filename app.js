//==============
// DEPENDENCIES
//==============
var Campground     = require('./models/campground'),
    Comment        = require('./models/comment'),
    methodOverride = require('method-override'),
    LocalStrategy  = require('passport-local'),
    flash          = require('connect-flash'),
    User           = require('./models/user'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    seedDB         = require('./seeds'),
    express        = require('express'),
    app            = express();

//===============
// ROUTER CONFIG
//===============
var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes    = require('./routes/comments'),
    indexRoutes      = require('./routes/index');

//======
// INIT
//======
mongoose.connect('mongodb://localhost/yelp_camp_v12');
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); // dirname is relational, here it's set => root/public/ as the starting point
app.use(methodOverride('_method'));
app.locals.moment = require('moment');
app.locals.locus = require('locus');
app.use(flash());
// seedDB();

//=================
// PASSPORT CONFIG
//=================
app.use(require('express-session')({
  secret: '999bonkers808', // secret is used to compute the hash, which means the session is then protected against hijacking by checking the fingerprint against the hash with the secret
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error'); // defining two different flash variables across all pages
   res.locals.success = req.flash('success');
   next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// LISTEN
app.listen(3000, function() {
  console.log('YelpCamp server is live on port 3000');
});


