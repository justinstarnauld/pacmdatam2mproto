'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);

// log an error if the connection fails
Mongoose.connection.on('error', error => {
  console.log('Mongoose connection error: ' + error);
});

// create a user Schema
const UserSchema = Mongoose.Schema({
  auth0Data: {
    id: {
      type: String,
      index: true
    },
    provider: String,
    displayName: String,
    email: String,
    pictureUrl: String,
    nickname: String,
  },
  savedDevices: []

});

const User = module.exports = Mongoose.model('User', UserSchema);

module.exports.createUser = (authId, profile) => {
  process.nextTick(() => {
    // find a user whose auth0 ID already exists in the database
    User.findOne({'auth0Data.id': authId}, (err, user) => {
      // if there are any errors, return those errors
      if (err)
        throw err;

      // check to see if there is already a user with that id
      if (user) {
        return user
      } else {
        // if there is no user with that id create a new user
        let newUser = new User();

        // set the user's profile data
        newUser.auth0Data.id = profile.id,
        newUser.auth0Data.provider = profile.provider,
        newUser.auth0Data.displayName = profile.displayName,
        newUser.auth0Data.email = !profile.emails ? null : profile.emails[0].value,
        newUser.auth0Data.pictureUrl = profile.picture,
        newUser.auth0Data.nickname = profile.nickname

        // save the user
        newUser.save((err) => {
          if (err)
            throw err;
          return newUser;
        });
      }
    });
  });
}

// module.exports.findUserByAuth0Id = (authId) => {
//   process.nextTick(() => {
//     // find a user whose auth0 ID already exists in the database
//     return new Promise((resolve, reject) => {
//       User.findOne({'auth0Data.id': authId}, (err, user) => {
//         if (error) {
//           reject(error)
//         } else {
//           console.log(user);
//           resolve(user);
//         }
//       });
//     });
//   });
// }
