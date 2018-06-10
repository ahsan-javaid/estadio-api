'use strict';

var mongoose = require('mongoose');

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

function emailValidate(input) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(input);
}


var UsersModel = function () {

  var usersSchema = mongoose.Schema({
      name: {type: String, default: ""},
      role: {type: String, enum: ['admin', 'facilityOwner']},
      email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: [emailValidate, 'Email is not valid']
      },
      password: {type: String},
      picture: {type: String, default: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'},
      createdAt: {type: Date, default: Date.now()},
      updatedAt: {type: Date, default: Date.now()}
    },
    {collection: 'Users'});

  usersSchema.statics.getHashedPassword = function (password) {

    return crypto.createHash('sha256').update(password).digest('base64');
  };

  usersSchema.methods.createAPIToken = function () {
    var payload = this.toClientObject();
    return jwt.sign(payload, global.kraken.get('app:jwtSecret'));
  };

  usersSchema.methods.toClientObject = function () {
    var rawObject = this.toObject();
    delete rawObject.password;
    delete rawObject.__v;
    return rawObject;
  };

  return mongoose.model('Users', usersSchema);
};

module.exports = new UsersModel();
