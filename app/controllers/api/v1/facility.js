const db = global.models;


module.exports =  (router) => {

  router.get('/', (req, res) => {
    db.Facility.find()
      .sort({ _id: -1 })
      .skip(req.query.offset ? parseInt(req.query.offset) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 0)
      .populate('userId')
      .then((facility) => {
      res.json({
        status: {
          code: 200,
          message: "success"
        },
        body: {
          facility: facility
        }
      })
    });
  });


  router.post('/', (req, res) => {
    req.body.location = req.body.location || {type: "Point", coordinates: [0, 0]};
    db.Facility.create(req.body).then((facility) => {
      res.json({
        status: {
          code: 200,
          message: "facility created"
        },
        body: {
          facility: facility
        }
      })
    });
  });

  router.put('/:id', (req, res) => {
    db.Facility.findOneAndUpdate({_id: req.params.id},req.body, {new: true}).then((facility) => {
      res.json({
        status: {
          code: 200,
          message: "facility updated"
        },
        body: {
          facility: facility
        }
      })
    });
  });

  router.delete('/:id', (req, res) => {
    db.Facility.remove({_id: req.params.id}).then((facility) => {
      res.json({
        status: {
          code: 200,
          message: "facility removed"
        },
        body: {
          facility: facility
        }
      })
    });
  });
};
