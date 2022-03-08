const express = require('express');
const app = express();
const port = 3001;
const unirest = require("unirest");

//const bearer = import.meta.env.VITE_TWITTER_BEARER_TOKEN;

app.get('/api/:word', (req, res) => {
  const request = unirest("GET", "https://api.twitter.com/2/tweets/search/recent?query=from:DeItaone");
  request.headers({
    "Access-Control-Allow-Origin": "*",
    "Authorization": "bearer ",
  });

  request.end(function (response) {
    if (response.error) throw new Error(response.error);
    res.json(response.body || {});
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});