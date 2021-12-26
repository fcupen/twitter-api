var express = require("express");
var router = express.Router();
var Twit = require("twit");

var fs = require("fs");
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
    // console.log(response);
  });
  // client.get('/statuses/user_timeline.json', { screen_name: 'francupen', count: 5}, (error, tweet, response) => {
  //   if (error) throw error;
  //   console.log(response);
  //   res.json({ response, tweet });
  // });
});
/* POST A TWEET. */
router.post("/", (req, res, next) => {
  var tweet = req.body.tweet;

  client.post(
    "statuses/update",
    { status: tweet },
    (error, tweet, response) => {
      // if (error) throw error;
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
    { media_data: req.body.media_data.split("base64,")[1], status: tweet },
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

/* POST A TWEET. */
router.delete("/repost/accounts/:id", (req, res, next) => {
  const id = req.params.id;
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    if (!db.repost_accounts) {
      db.repost_accounts = [];
    }

    const repost_accounts = db.repost_accounts.filter(
      (repost) => repost !== id
    );
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({
        ...db,
        repost_accounts: repost_accounts,
      }),
      (err) => {
        if (err) throw err;
        res.json(db.repost_accounts);
      }
    );
  });
});

/* POST JOB. */
router.post("/job/add", (req, res, next) => {
  var body = req.body;
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    if (!db.job) {
      db.job = [];
    }
    db.job.push(...body);
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({
        ...db,
        job: db.job,
      }),
      (err) => {
        if (err) throw err;
        res.json(db.job);
      }
    );
  });
});
/* GET JOBS. */
router.get("/job/get", (req, res, next) => {
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    if (!db.job) {
      db.job = [];
    }
    res.json(db.job);
  });
});
router.delete("/job/:id", function (req, res, next) {
  const id = req.params.id;
  const key = 'job';
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    db[key].splice(id, 1);
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({ ...db, [key]: db[key] }),
      (err) => {
        if (err) throw err;
        res.json({ ...db, [key]: db[key] });
      }
    );
  });
});


/* POST jobtrend. */
router.post("/jobtrend/add", (req, res, next) => {
  var body = req.body;
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    if (!db.jobtrend) {
      db.jobtrend = [];
    }
    db.jobtrend.push(...body);
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({
        ...db,
        jobtrend: db.jobtrend,
      }),
      (err) => {
        if (err) throw err;
        res.json(db.jobtrend);
      }
    );
  });
});
/* GET jobtrend. */
router.get("/jobtrend/get", (req, res, next) => {
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    if (!db.jobtrend) {
      db.jobtrend = [];
    }
    res.json(db.jobtrend);
  });
});
router.delete("/jobtrend/:id", function (req, res, next) {
  const id = req.params.id;
  const key = 'jobtrend';
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    db[key].splice(id, 1);
    fs.writeFile(
      "./db/db.json",
      JSON.stringify({ ...db, [key]: db[key] }),
      (err) => {
        if (err) throw err;
        res.json(db[key]);
      }
    );
  });
});

/* POST A ACCOUNT. */
router.post("/repost/accounts", (req, res, next) => {
  var body = req.body;
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    if (!db.repost_accounts) {
      db.repost_accounts = [];
    }
    if (!db.repost_accounts.includes(body.id)) {
      db.repost_accounts.push(body.id);
      fs.writeFile(
        "./db/db.json",
        JSON.stringify({
          ...db,
          repost_accounts: db.repost_accounts,
        }),
        (err) => {
          if (err) throw err;
          res.json(db.repost_accounts);
        }
      );
    } else {
      res.json(db.repost_accounts);
    }
  });
});
/* GET ACCOUNTS. */
router.get("/repost/accounts", (req, res, next) => {
  fs.readFile("./db/db.json", (err, data) => {
    let db = JSON.parse(data);
    if (!db.repost_accounts) {
      db.repost_accounts = [];
    }
    res.json(db.repost_accounts);
  });
});
/* REPOST A TWEET. */
router.get("/repost/tweets/:id", (req, res, next) => {
  const id = req.params.id;
  T.get(
    "search/tweets",
    { q: "nft", count: 200 },
    function (err, data, response) {
      // console.log(data);
      res.json(data.statuses);
    }
  );
  // client.get(
  //   "/statuses/user_timeline.json",
  //   { screen_name: id, count: 5 },
  //   (error, tweet, response) => {
  //     if (error) throw error;
  //     console.log(tweet);
  //     const tweets = tweet.reduce((p, n) => {
  //       return { ...p, [n.id]: n };
  //     }, {});
  //     fs.readFile("./db/db.json", (err, data) => {
  //       let db = JSON.parse(data);
  //       if (!db.repost_tweets) {
  //         db.repost_tweets = {};
  //       }
  //       if (!db.repost_tweets[tweet[0].user.id]) {
  //         db.repost_tweets[tweet[0].user.id] = {};
  //       }
  //       fs.writeFile(
  //         "./db/db.json",
  //         JSON.stringify({
  //           ...db,
  //           repost_tweets: {
  //             ...db.repost_tweets,
  //             [tweet[0].user.id]: {
  //               ...db.repost_tweets[tweet[0].user.id],
  //               ...tweets,
  //             },
  //           },
  //         }),
  //         (err) => {
  //           if (err) throw err;
  //           res.json(tweet);
  //         }
  //       );
  //     });
  //   }
  // );
});

// client.get('/statuses/user_timeline.json', { screen_name: 'francupen', count: 5}, (error, tweet, response) => {
//   if (error) throw error;
//   console.log(response);
//   res.json({ response, tweet });
// });

// /* STREAM TWEET. */
// router.get("/streams", (req, res, next) => {
//   fs.readFile("./db/db.json", (err, data) => {
//     let db = JSON.parse(data).streams;
//     res.json({ response: db });
//   });
// });

// /* STREAM TWEET. */
// router.get("/streams/last", (req, res, next) => {
//   res.json({ response: tweetStreams });
// });

// /* STREAM TWEET. */
// router.post("/streams/:id", (req, res, next) => {
//   const id = req.params.id;
//   console.log(id);
//   // var stream = client.stream("statuses/filter", {
//   //   follow: Number(id),
//   // });
//   // stream.on("data", function (event) {
//   //   console.log(event);

//   //   // if (!db.streamsTweets) {
//   //   //   db.streamsTweets = [];
//   //   // }
//   //   // fs.writeFile(
//   //   //   "./db/db.json",
//   //   //   JSON.stringify({
//   //   //     ...db,
//   //   //     streamsTweets: [event, ...db.streamsTweets],
//   //   //   }),
//   //   //   (err) => {
//   //   //     if (err) throw err;
//   //   //   }
//   //   // );
//   // });

//   // stream.on("error", function (error) {
//   //   console.log("----- ERROR -----", error);
//   //   throw error;
//   // });

//   // try {
//   //   fs.readFile("./db/db.json", (err, data) => {
//   //     let db = JSON.parse(data);
//   //     if (!db.streams) {
//   //       db.streams = [];
//   //     }
//   //     db.streams.push(id);
//   //     fs.writeFile(
//   //       "./db/db.json",
//   //       JSON.stringify({ ...JSON.parse(data), streams: db.streams }),
//   //       (err) => {
//   //         if (err) throw err;
//   //         // start_streams();

//   //         res.json({ response: streams });
//   //       }
//   //     );
//   //   });
//   // } catch (error) {
//   //   console.log(error);
//   // }
// });

// /* STREAM TWEET. */
// router.delete("/streams/:id", (req, res, next) => {
//   const id = req.params.id;
//   fs.readFile("./db/db.json", (err, data) => {
//     let streams = JSON.parse(data).streams;
//     streams.splice(Number(id), 1);
//     fs.writeFile(
//       "./db/db.json",
//       JSON.stringify({ ...JSON.parse(data), streams }),
//       (err) => {
//         if (err) throw err;
//         res.json({ response: streams });
//       }
//     );
//   });
// });

// /* STREAM TWEET. */
// router.delete("/streams-tweet/:id", (req, res, next) => {
//   const id = req.params.id;
//   tweetStreams.splice(Number(id), 1);
//   res.json({ response: tweetStreams });
// });

// function start_streams() {
//   fs.readFile("./db/db.json", (err, data) => {
//     let db = JSON.parse(data);

//     console.log("----- streams -----", db);
//     db.streams.forEach((id) => {
//       var stream = client.stream("statuses/filter", { follow: Number(id) });
//       stream.on("data", function (event) {
//         console.log(event);

//         if (!db.streamsTweets) {
//           db.streamsTweets = [];
//         }
//         fs.writeFile(
//           "./db/db.json",
//           JSON.stringify({
//             ...db,
//             streamsTweets: [event, ...db.streamsTweets],
//           }),
//           (err) => {
//             if (err) throw err;
//           }
//         );
//       });

//       stream.on("error", function (error) {
//         console.log("----- ERROR -----", error);
//         throw error;
//       });
//     });
//   });
// }
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

// var stream = client.stream(
//   "statuses/filter",
//   { track: "nft" }
//   // { follow: "876596261931155456" }
// );
// stream.on("data", function (event) {
//   console.log(event && event.text);
// });

// stream.on("error", function (error) {
//   throw error;
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
