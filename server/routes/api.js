var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET TWEETS. */
router.get("/", function (req, res, next) {
  fs.readFile("./db/db.json", (err, data) => {
    let data_json = JSON.parse(data);
    res.json(data_json);
  });
});
/* POST TWEET. */
router.post("/", function (req, res, next) {
  var tweet = req.body;
  fs.readFile("./db/db.json", (err, data) => {
    let tweets = JSON.parse(data).tweets;
    tweets.tweets.unshift(tweet);
    fs.writeFile("./db/db.json", JSON.stringify({ tweets:tweets.tweets }), (err) => {
      if (err) throw err;
      res.json(tweets);
    });
  });
});
/* PUT TWEET. */
router.put("/:id", function (req, res, next) {
  var tweet = req.body;
  const id = req.params.id;
  fs.readFile("./db/db.json", (err, data) => {
    let tweets = JSON.parse(data).tweets;
    tweets[Number(id)] = tweet;
    fs.writeFile("./db/db.json", JSON.stringify({ tweets }), (err) => {
      if (err) throw err;
      res.json(tweets);
    });
  });
});
/* DELETE TWEET. */
router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  fs.readFile("./db/db.json", (err, data) => {
    let tweets = JSON.parse(data);
    tweets.tweets.splice(id, 1);
    fs.writeFile("./db/db.json", JSON.stringify({ tweets:tweets.tweets }), (err) => {
      if (err) throw err;
      res.json(tweets);
    });
  });
});

module.exports = router;
