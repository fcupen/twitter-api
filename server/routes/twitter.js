var express = require("express");
var router = express.Router();
var Twit = require("twit");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const multer = require("multer");
const upload = multer();
let streams = [];
let tweetStreams = [];

var Twitter = require("twitter");
var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret,
});
var T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret,
});
/* GET LAST TWEETS. */
router.get("/", (req, res, next) => {
  client.get("statuses/home_timeline", (error, tweet, response) => {
    if (error) throw error;
    console.log(response);
  });
});
/* POST A TWEET. */
router.post("/", (req, res, next) => {
  var tweet = req.body.tweet;

  client.post(
    "statuses/update",
    { status: tweet },
    (error, tweet, response) => {
      if (error) throw error;
      res.json({ response });
    }
  );
});
/* POST A TWEET. */
router.post("/media", upload.any(), (req, res, next) => {
  var tweet = req.body.tweet;
  // console.log(req.body)
  T.post(
    "media/upload",
    { media_data: req.body.media_data.split("base64,")[1] },
    function (err, data, response) {
      if (err) {
        res.json({ err, response, data });
      }
      var mediaIdStr = data.media_id_string;
      var altText = req.body.altText;
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };
      T.post(
        "media/metadata/create",
        meta_params,
        function (err, data, response) {
          if (err) {
            res.json({ err, response, data });
          }
          if (!err) {
            var params = {
              status: tweet.tweet,
              media_ids: [mediaIdStr],
            };

            T.post("statuses/update", params, function (err, data, response) {
              if (err) {
                res.json({ err, response, data });
              }
              res.json({ response, data });
            });
          }
        }
      );
    }
  );
});
/* POST A TWEET. */
router.post("/retweet", (req, res, next) => {
  var tweet = req.body.tweet;

  T.post(
    "statuses/retweet/:id",
    { id: tweet.id },
    function (err, data, response) {
      res.json({ response, data });
    }
  );
});
/* POST A TWEET. */
router.post("/slug", (req, res, next) => {
  var tweet = req.body.tweet;
  var stream = T.stream("statuses/filter", { track: tweet.slug });

  stream.on("tweet", function (tweet) {
    console.log(tweet);
  });
});


/* STREAM TWEET. */
router.get("/stream", (req, res, next) => {
  res.json({ response: streams });
});

/* STREAM TWEET. */
router.get("/stream/last", (req, res, next) => {
  res.json({ response: tweetStreams });
});

/* STREAM TWEET. */
router.post("/stream/:id", (req, res, next) => {
  const id = req.params.id;
  streams.push(id);
  var stream = client.stream("statuses/filter", { follow: id });
  stream.on("data", function (event) {
    console.log(event);
    tweetStreams.push(event);
  });

  stream.on("error", function (error) {
    throw error;
  });
  res.json({ response: streams });
});

/* STREAM TWEET. */
router.delete("/stream/:id", (req, res, next) => {
  const id = req.params.id;
  streams.splice(Number(id), 1);
  res.json({ response: streams });
});

/* STREAM TWEET. */
router.delete("/stream-tweet/:id", (req, res, next) => {
  const id = req.params.id;
  tweetStreams.splice(Number(id), 1);
  res.json({ response: tweetStreams });
});

// /* STREAM TWEET. */
// router.post("/stream", (req, res, next) => {
//   var stream = client.stream(
//     "statuses/filter",
//     // { track: "javascript" }
//     { follow: "876596261931155456" }
//   );
//   stream.on("data", function (event) {
//     console.log(event && event.text);
//   });

//   stream.on("error", function (error) {
//     throw error;
//   });
// });

module.exports = router;

// //
// //  tweet 'hello world!'
// //
// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//   console.log(data)
// })

// //
// //  search twitter for all tweets containing the word 'banana' since July 11, 2011
// //
// T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
//   console.log(data)
// })

// //
// //  get the list of user id's that follow @tolga_tezel
// //
// T.get('followers/ids', { screen_name: 'tolga_tezel' },  function (err, data, response) {
//   console.log(data)
// })

// //
// // Twit has promise support; you can use the callback API,
// // promise API, or both at the same time.
// //
// T.get('account/verify_credentials', { skip_status: true })
//   .catch(function (err) {
//     console.log('caught error', err.stack)
//   })
//   .then(function (result) {
//     // `result` is an Object with keys "data" and "resp".
//     // `data` and `resp` are the same objects as the ones passed
//     // to the callback.
//     // See https://github.com/ttezel/twit#tgetpath-params-callback
//     // for details.

//     console.log('data', result.data);
//   })

// //
// //  retweet a tweet with id '343360866131001345'
// //
// T.post('statuses/retweet/:id', { id: '343360866131001345' }, function (err, data, response) {
//   console.log(data)
// })

// //
// //  destroy a tweet with id '343360866131001345'
// //
// T.post('statuses/destroy/:id', { id: '343360866131001345' }, function (err, data, response) {
//   console.log(data)
// })

// //
// // get `funny` twitter users
// //
// T.get('users/suggestions/:slug', { slug: 'funny' }, function (err, data, response) {
//   console.log(data)
// })

// //
// // post a tweet with media
// //
// var b64content = fs.readFileSync('/path/to/img', { encoding: 'base64' })

// // first we must post the media to Twitter
// T.post('media/upload', { media_data: b64content }, function (err, data, response) {
//   // now we can assign alt text to the media, for use by screen readers and
//   // other text-based presentations and interpreters
//   var mediaIdStr = data.media_id_string
//   var altText = "Small flowers in a planter on a sunny balcony, blossoming."
//   var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

//   T.post('media/metadata/create', meta_params, function (err, data, response) {
//     if (!err) {
//       // now we can reference the media and post a tweet (media will attach to the tweet)
//       var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }

//       T.post('statuses/update', params, function (err, data, response) {
//         console.log(data)
//       })
//     }
//   })
// })

// //
// // post media via the chunked media upload API.
// // You can then use POST statuses/update to post a tweet with the media attached as in the example above using `media_id_string`.
// // Note: You can also do this yourself manually using T.post() calls if you want more fine-grained
// // control over the streaming. Example: https://github.com/ttezel/twit/blob/master/tests/rest_chunked_upload.js#L20
// //
// var filePath = '/absolute/path/to/file.mp4'
// T.postMediaChunked({ file_path: filePath }, function (err, data, response) {
//   console.log(data)
// })

// //
// //  stream a sample of public statuses
// //
// var stream = T.stream('statuses/sample')

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })

// //
// //  filter the twitter public stream by the word 'mango'.
// //
// var stream = T.stream('statuses/filter', { track: 'mango' })

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })

// //
// // filter the public stream by the latitude/longitude bounded box of San Francisco
// //
// var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]

// var stream = T.stream('statuses/filter', { locations: sanFrancisco })

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })

// //
// // filter the public stream by english tweets containing `#apple`
// //
// var stream = T.stream('statuses/filter', { track: '#apple', language: 'en' })

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })
