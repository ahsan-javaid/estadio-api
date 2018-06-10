const db = global.models;
const mailer = global.mailer;

module.exports =  (router) => {

  router.get('/', (req, res) => {
    db.Users.find({role:'facilityOwner'})
      .sort({ _id: -1 })
      .skip(req.query.offset ? parseInt(req.query.offset) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 0)
      .then((users) => {
        res.json({
          status: {
            code: 200,
            message: "success"
          },
          body: {
            users: users
          }
        })
      });
  });

  router.post('/sign-up',  (req, res) => {

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
      req.body.role = 'facilityOwner';

      db.Users.create(req.body).then((user) => {
        res.json({
          status: {
            code: 200,
            message: "user is created."
          },
          body: {
            user: user.toClientObject(),
            token: user.createAPIToken()
          }
        });
        user.password = password;
        mailer.sendWelcomeEmail(user);
      }).catch((err) => {
        console.log(">>>>>>>>>>",err);
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
      Users.findOne({
        email: req.body.email,
        password: db.Users.getHashedPassword(req.body.password),
        role:'facilityUser'
      }).then((user) => {
        if (user) {
          res.json({
            status: {
              code: 200,
              message: "user is signed in"
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
