var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  cost: Number,
  location: String,
  lat: Number,
  lng: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});
// var Campground = mongoose.model('Campground', campgroundSchema);
module.exports = mongoose.model('Campground', campgroundSchema); // pushing the model to app.js

