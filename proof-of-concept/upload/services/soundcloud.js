var os = require("os");
var fs = require("fs");
var path = require("path");
var request = require("request");

var soundcloud = module.exports = function (req, res, next) {
   req.services = req.services || {};
   req.services.soundcloud = new SoundCloudService(req);
   return next();
};

var SoundCloudService = function (req) {
   this.session = req.session;
};

SoundCloudService.prototype.uploadAudio = function (title, audioStream) {
  console.log('uploading audio to soundcloud');

  var fileName = "" + Math.floor(Math.random() * 10000);
  var tmpFile = path.join("/tmp", fileName);
  // audioStream.pipe(fs.createWriteStream(tmpFile));

  request({ 
    method: "POST", 
    uri: "https://api.soundcloud.com/tracks.json", 
    multipart: [ 
      {
        "content-type": "application/x-www-form-urlencoded",
        body: "oauth_token=" + this.session.oauth.accessToken + "&track[title]=" + title + "&track[sharing]=public"
      },
      {
        "content-length": audioStream.headers["content-length"],
        "content-type": audioStream.headers["content-type"],
        body: audioStream
      }
    ]
  }, function() {
    console.log(arguments);
  });

  // var req = request.post("https://api.soundcloud.com/tracks.json", function () {
  //   console.log(arguments);
  // });
  // var form = req.form();

  // form.append("oauth_token", this.session.oauth.accessToken);
  // form.append("track[asset_data]", fs.createReadStream(tmpFile));
  // form.append("track[title]", title);
  // form.append("track[sharing]", "public");

  console.log('finished uploading audio to soundcloud');
};