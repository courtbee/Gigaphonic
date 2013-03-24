var querystring = require("querystring"),
    request = require("request"),
    clientId = process.env.GITHUB_CLIENT_ID || "3bac0c7e3cff7e9c3a0fd3bbbb57718c",
    clientSecret = process.env.GITHUB_CLIENT_SECRET || "ba232cf80191a2f4823661c281dda608",
    auth = module.exports = {};

auth.login = function (req, res, next) {
  var endpoint = "https://soundcloud.com/connect",
      qs = { 
        client_id: clientId,
        redirect_uri: "http://localhost:5000/login/callback",
        response_type: "code",
        scope: "non-expiring"
      },
      url = endpoint + "?" + querystring.stringify(qs);

  return res.redirect(url);
};

auth.callback = function (req, res, next) {
  var endpoint = "https://api.soundcloud.com/oauth2/token",
      options = {
        form: {
          client_id: clientId,
          client_secret: clientSecret,
          code: req.query.code,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:5000/login/callback"
        },
        headers: {
          "Accept": "application/json"
        }
      };

  request.post(endpoint, options, function (err, r, body) {
    if (err) return next(err);
    if (r.statusCode !== 200) return next("Error fetching token: " + body);

    try { body = JSON.parse(body); }
    catch (e) { return next("Unable to parse token response: " +  e.toString()); }

    if (body.error) return next("Error from token response: " + body.error);

    req.session.oauth = {
      accessToken: body.access_token,
      tokenType: body.token_type
    };

    req.session.user = "blah";
    return res.redirect("/blah");

    // req.services.github.getUser(function (err, user) {
    //   if (err) return next(err);

    //   // user.save(function (err) {
    //   //   if (err) return next(err);
    //     req.session.user = user;
    //     return res.redirect("/" + user.username);
    //   // });
    // });
  });
};

auth.logout = function (req, res, next) {
  req.session.destroy();
  return res.redirect("/");
};

auth.middleware = function (req, res, next) {
  res.locals.authUser = req.session.user;
  return next();
};

auth.require = function (req, res, next) {
  var user = req.session.user;

  if (user) {
    next();
  }
  else {
    console.log("Unauthorized for " + req.url);
    next(401);
  }
}