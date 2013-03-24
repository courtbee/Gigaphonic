var fs = require('fs');

var audio = module.exports = {};

audio.uploadAudio = function (req, res) {
  console.log('uploading audio!');
  console.log(req.headers);

  req.services.soundcloud.uploadAudio("awesome title", req);
}