var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var Users = require('../models/users');
var smtpTransport = require('nodemailer-smtp-transport');
var gmailConfig = require('../../config/config.json').gmail;
var nodemailer = nodemailer.createTransport(smtpTransport(gmailConfig));

module.exports = function() {
  var mailer={};
  mailer.sendWelcomeEmail= function(user) {
    var templateDir = path.join(__dirname, '..', 'email_templates', 'welcome_user');
    var welcomeMail = new EmailTemplate(templateDir);
    welcomeMail.render({
      firstName: user.name,
      password: user.password,
      email:user.email
    }, function (err, result) {
      var email = {
        from: gmailConfig.auth.user,
        to: user.email,
        subject: 'Welcome '+ user.name+ '',
        html: result.html,
        envelope: {
          from: 'Estadio '+gmailConfig.auth.user,
          to: user.email
        }
      };
      nodemailer.sendMail(email, function (error, res) {
        if (error) {
          console.log(error);
        } else {
          console.log(res)
        }
      });
    });
  }
 return mailer;
}
