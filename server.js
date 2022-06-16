const express = require("express");
const querystring = require("querystring");
const request = require("request");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
let client_id = process.env.client_id;
let client_secret = process.env.client_secret;

let redirect_uri = `http://localhost:${PORT}/callback`;
let scope = "user-read-private user-read-email";

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
      })
  );
});

app.get("/callback", (req, res) => {
  let code = req.query.code || null;

  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      let token_type = body.token_type;
      let scope = body.scope;
      let expires_in = body.expires_in;

      res.send({
        access_token: access_token,
        token_type: token_type,
        scope: scope,
        expires_in: expires_in,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Working on port ${PORT}`);
});
