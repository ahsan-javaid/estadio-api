const promise = require('bluebird');
const jwtVerify = promise.promisify(require('jsonwebtoken').verify);
const Users = require('../models/users');
module.exports = function () {
  return function (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(400).send({status: "error", message: "authorization header missing"}).end();
    }
    const token = req.headers.authorization.split(' ')[1];
    jwtVerify(token, req.app.kraken.get('app:jwtSecret')).then(function (decoded) {
      if (!decoded) {
        return res.status(400).send({status: "error", message: "invalid token"}).end();
      }
      Users.findById(decoded._id).then(function (user) {
        if (!user) {
          return res.status(400).send({status: "error", message: "user not found"}).end();

        }
        req.user = user;
        next();
      }).catch(function (err) {
        global.log.error(err);
        return res.status(400).send({status: "error", message: "invalid token"}).end();

      });
    }).catch(function (err) {
      global.log.error(err);
      return res.status(400).send({status: "error", message: "invalid token"}).end();

    });
  }
}
