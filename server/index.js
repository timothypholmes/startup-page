// https://rapidapi.com/blog/create-react-app-express/

const express = require('express');
const app = express();
const port = 3001;
const unirest = require("unirest");


/*
app.get('/api/:word', (req, res) => {
  const request = unirest("GET", "https://api.twitter.com/2/tweets/search/recent?query=from:DeItaone");
  request.headers({
    "Authorization": "bearer",
  });

  request.end(function (response) {
    if (response.error) throw new Error(response.error);
    res.json(response.body.data || {});
  });

});
*/

app.get('/api/:word', (req, res) => {
  const request = unirest("GET", "https://www.bloomberg.com/markets/api/bulk-time-series/price/GOLD%3AUS?timeFrame=1_DAY");

  request.end(function (response) {
    if (response.error) throw new Error(response.error);
    res.json(response.body || {});
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});