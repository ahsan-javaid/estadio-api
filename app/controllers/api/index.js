const path = require('path');
const fs = require('fs');
const urljoin = require('url-join');

module.exports = function (router) {

  router.post('/upload', function (req, res) {

    if (req.files && req.files.file) {
      let dir = './files';
      let destLocation = dir + '/' + path.basename(req.files.file.path);

      if (!fs.existsSync(dir)) {
        fs.mkdir(dir);
      }

      let source = fs.createReadStream(req.files.file.path);
      let dest = fs.createWriteStream(destLocation);

      source.pipe(dest);

      url = urljoin('/', 'files', path.basename(req.files.file.path));
      res.status(200).json({
        status: {
          code: 200,
          message: "success"
        },
        body: {url}
      })
    } else {
      res.status(400).json({
        status: {
          code: 400,
          message: "no file provided."
        },
        body: {}
      })
    }

  });

};
