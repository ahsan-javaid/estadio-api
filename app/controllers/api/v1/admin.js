const db = global.models;
const mailer = global.mailer;

module.exports =  (router) => {

  router.post('/create',  (req, res) => {

    if (!req.body.email || !req.body.password) {
      res.json({
        status: {
          code: 400,
          message: "email & password is required."
        },
        body: {}
      })
    } else {
      let password = req.body.password;
      req.body.password = db.Users.getHashedPassword(req.body.password);
      req.body.role = 'admin';
      db.Users.create(req.body).then((user) => {
        res.json({
          status: {
            code: 200,
            message: "admin is created."
          },
          body: {
            user: user.toClientObject(),
            token: user.createAPIToken()
          }
        });
        user.password = password;
        mailer.sendWelcomeEmail(user);
      }).catch((err) => {
        res.json({
          status: {
            code: 400,
            message: "email already exists"
          },
          body: {err:err}
        })
      })
    }
  });

  router.post('/sign-in', (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.json({
        status: {
          code: 400,
          message: "email & password is required."
        },
        body: {}
      })
    } else {
      db.Users.findOne({
        email: req.body.email,
        password: db.Users.getHashedPassword(req.body.password),
        role:'admin'
      }).then((user) => {
        if (user) {
          res.json({
            status: {
              code: 200,
              message: "admin is signed in"
            },
            body: {
              user: user.toClientObject(),
              token: user.createAPIToken(user)
            }
          })
        } else {
          res.json({
            status: {
              code: 400,
              message: "You have entered invalid credentials."
            },
            body: {}
          })
        }
      })
    }

  });

};
