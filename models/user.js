var passportLocalMongoose = require('passport-local-mongoose');
    mongoose              = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  firstName: String,
  lastName: String,
  email: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
});

UserSchema.plugin(passportLocalMongoose); // provides the UserSchema with auth methods
module.exports = mongoose.model('User', UserSchema);



