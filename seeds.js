var Campground   = require('./models/campground'),
    Comment      = require('./models/comment'),
    mongoose     = require('mongoose');

data = [
{
  name: 'Seed Camp 1',
  image: 'https://images.unsplash.com/photo-1496545672447-f699b503d270?auto=format&fit=crop&w=1951&q=80',
  description: 'Spicy jalapeno ball tip drumstick tongue, kielbasa filet mignon biltong shankle tenderloin hamburger picanha jowl meatloaf. Shoulder pork filet mignon chicken prosciutto tongue swine biltong picanha sausage beef. Cupim tenderloin pork chop landjaeger, kielbasa ground round tongue biltong filet mignon tri-tip shoulder chuck. Turducken capicola frankfurter ribeye boudin leberkas beef ribs doner jowl pig pastrami short loin.'
},
{
  name: 'Seed Camp 2',
  image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1950&q=80',
  description: 'seed camp2'
},
{
  name: 'Seed Camp 3',
  image: 'https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?auto=format&fit=crop&w=1950&q=80',
  description: 'seed camp3'
}
];

function seedDB() {
  // remove all seed camps from db
  Campground.remove({}, function(err) {
    if(err) {
      console.log(err);
    }
    console.log('previous campsites purged');
    // add new seed camps
    // data.forEach(function(seedcamp) {
    //   Campground.create(seedcamp, function(err, campground) {
    //     if(err) {
    //       console.log(err);
    //     } else {
    //       console.log('seed camps added');
    //       // create comments for seed camps
    //       Comment.create(
    //       {
    //         text: 'This place is great, but I wish there was internet.',
    //         author: 'Homer Barnes'
    //       }, function(err, comment) {
    //         if(err) {
    //           console.log(err);
    //         } else {
    //           campground.comments.push(comment);
    //           campground.save();
    //           console.log('comments for new seedcamps added');
    //         }
    //       });
    //     }
    //   });
    // });
  });
}

module.exports = seedDB;
















