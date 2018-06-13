'use strict';

var mongoose = require('mongoose');

var FacilityModel = function () {

  var schema = mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      facilityName: {type: String, default: ""},
      stadiumCount: {type: Number, default: ""},
      address: {type: String, default: ""},
      contractType: {type: String, default: ""},
      email: {type: String, default: ""},
      contractFile: {type: String, default: ""},
      facilityCount: {type: Number, default: 0},
      country: {type: String, default: ""},
      location: {
        type: {
          type: String,
          required: true,
          enum: ["Point", "LineString", "Polygon"],
          default: "Point"
        },
        coordinates: [Number],
      },
      picture: {type: String, default: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'},
      city: {type: String, default: ""},
      accountNumber: {type: String, default: ""},
      phoneNumber: {type: String, default: ""},
      mobileNumber: {type: String, default: ""},
      otherContactNumber: {type: String, default: ""},
      website: {type: String, default: ""},
      facebook: {type: String, default: ""},
      twitter: {type: String, default: ""},
      instagram: {type: String, default: ""},
      snapchat: {type: String, default: ""},
      companyLogo: {type: String, default: ""},
      contractDetails: {type: String, default: ""},
      packageType: {type: String, default: ""},
      bankName: {type: String, default:""},
      createdAt: {type: Date, default: Date.now()},
      updatedAt: {type: Date, default: Date.now()}
    },
    {collection: 'Facility'});

  schema.index({ location : "2dsphere" });
  return mongoose.model('Facility', schema);
};

module.exports = new FacilityModel();
