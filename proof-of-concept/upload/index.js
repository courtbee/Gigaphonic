var fs = require("fs");
var http = require("http");
var express = require("express");
var app = express();
var auth = require("./controllers/auth");
var audio = require("./controllers/audio");

var server = http.createServer(app);
var port = process.env.PORT || 3000;

app.set("view engine", "jade");

// app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'licketyboots'}));
app.use(express.static(__dirname + '/public'))
app.use(require("connect-assets")());
app.use(auth.middleware);

app.use(require("./services/soundcloud"));

app.get("/login", auth.login);
app.get("/login/callback", auth.callback);
app.get("/logout", auth.logout);

app.get("/", function (req, res) {
   res.render("index");
});

app.get("/:user", auth.require, function (req, res) {
   res.render("proof");
});

app.post("/audio", auth.require, audio.uploadAudio)

server.listen(port, function () {
  console.log("listening on " + port);
});