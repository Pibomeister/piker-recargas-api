'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const userSchema = mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

});
userSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function(){
  let user = this;
  let access = 'auth';

  let token = jwt.sign({_id: user._id.toHexString(), access}, 'pikeresgay').toString();
  user.tokens.push({access, token});
  return user.save().then(() => {
    console.log('Token here: ', token);
      return token;
  });
};

userSchema.statics.findByToken = function(token){
  const User = this;
  let decoded;


  try {
    decoded = jwt.verify(token, 'pikeresgay');
  } catch (err) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

module.exports = mongoose.model('User', userSchema);
