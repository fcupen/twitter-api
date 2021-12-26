<template>
  <div class="q-pa-md doc-container w100" style="align-self: flex-start">
    <div class="col w100 self-center flex">
      <div class="q-pa-md w100">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="tweet"
            label="Your tweet"
            hint="Max 160"
            maxlength="160"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please tweet something']"
          />
          <q-file filled v-model="file" label="Attached" />
          <div class="w100 flex" style="justify-content: space-around">
            <q-date v-model="days" multiple :events="events" :options="optionsFn" />
            <q-time v-model="time" format24h />
          </div>
          <div class="w100 flex">
            <q-checkbox
              dense
              v-model="instagramPost"
              label="Instagram Post"
              color="teal"
            />
            <q-checkbox
              dense
              v-model="instagramReel"
              label="Instagram Reel"
              color="orange"
            />
            <q-checkbox dense v-model="twitterPost" label="Twitter Post" color="red" />
          </div>
          <div class="w100 flex">
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </div>
    </div>
    <q-table class="w100" title="JOBS" :rows="rows" :columns="columns" row-key="tweet_id">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="tweet_id" :props="props">
            <q-btn round color="deep-orange" @click="deleteTweet(props)" icon="delete" />
          </q-td>
          <q-td key="send" :props="props">
            <q-btn round color="blue" @click="submit(props.row)" icon="send" />
          </q-td>
          <q-td key="Tweet" :props="props"
            ><q-btn
              round
              color="blue"
              @click="submit(props.row, ['twitter'])"
              icon="send"
            />
          </q-td>
          <q-td key="IGPost" :props="props">
            <q-btn
              round
              color="blue"
              @click="submit(props.row, ['ig_post'])"
              icon="send"
            />
          </q-td>
          <q-td key="IGStory" :props="props">
            <q-btn
              round
              color="blue"
              @click="submit(props.row, ['ig_story'])"
              icon="send"
            />
          </q-td>
          <q-td key="tweet" :props="props">
            <img :src="props.row.file" style="max-width: 50px" />
            {{ props.row.tweet }}
            <q-popup-edit v-model="props.row.tweet">
              <q-input v-model="props.row.tweet" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="date" :props="props">
            {{ props.row.date }}
          </q-td>
          <q-td key="qdate" :props="props">
            {{ props.row.qdate }}
            <q-popup-edit v-model="props.row.qdate" title="Update date">
              <q-date
                :options="optionsFn"
                @update:model-value="refreshData(props)"
                v-model="props.row.qdate"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="qtime" :props="props">
            {{ props.row.qtime }}
            <q-popup-edit v-model="props.row.qtime" title="Update time">
              <q-time v-model="props.row.qtime" format24h />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- <div class="w100 q-mt-md" style="display: flex">
      <div class="w100">
        <q-btn label="Get streams" type="button" color="primary" @click="getReposts()" />
      </div>
      <div class="w100" style="display: flex">
        <q-input filled v-model="ID_TWITTER" label="ID Twitter" />
        <q-btn
          label="Set Stream"
          type="button"
          @click="setReposts(ID_TWITTER)"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </div> -->
    <div
      class="q-table__container q-table--horizontal-separator column no-wrap q-table__card q-table--no-wrap q-mt-md"
    >
      <h5>Trend to Send</h5>
      <q-btn
        label="Send trends (3min)"
        type="button"
        @click="trendsToSend()"
        color="primary"
        class="q-ml-sm"
      />
      <table class="q-table">
        <tr class="q-table__top" style="font-weight: bolder">
          <td>Id</td>
          <td>Username</td>
          <td>Followers</td>
          <td>Following</td>
          <td>Retweet</td>
          <td>Like</td>
          <td>Quote</td>
          <td>Reply</td>
          <td></td>
          <td style="max-width: 200px">Tweet</td>
        </tr>
        <tr v-for="(link, index) in listTweetTrendToSend" :key="index" v-bind="link">
          <td>{{ listTweetTrendToSend[index].id }}</td>
          <td>{{ listTweetTrendToSend[index].user?.screen_name }}</td>
          <td>{{ listTweetTrendToSend[index].user?.followers_count }}</td>
          <td>{{ listTweetTrendToSend[index].user?.friends_count }}</td>
          <td>{{ listTweetTrendToSend[index].retweet_count }}</td>
          <td>{{ listTweetTrendToSend[index].favorite_count }}</td>
          <td>{{ listTweetTrendToSend[index].quote_count }}</td>
          <td>{{ listTweetTrendToSend[index].reply_count }}</td>
          <td>
            <q-btn
              round
              color="deep-orange"
              @click="removeToTrendsToSend(index)"
              icon="delete"
            />
            <q-btn
              round
              color="blue"
              @click="sendTweet(listTweetTrendToSend[index])"
              icon="send"
            />
          </td>
          <td>
            <img
              v-if="
                listTweetTrendToSend[index].extended_entities &&
                listTweetTrendToSend[index].extended_entities.media &&
                listTweetTrendToSend[index].extended_entities.media[0]
                  ? listTweetTrendToSend[index].extended_entities.media[0].media_url_https
                  : ''
              "
              :src="
                listTweetTrendToSend[index].extended_entities?.media[0].media_url_https
              "
            />
            <span>
              {{ listTweetTrendToSend[index].text }}
            </span>
          </td>
        </tr>
      </table>
    </div>
    <div class="w100 q-mt-md">
      <q-btn
        :label="startedTweet ? 'Stop Timer' : 'Star Timer'"
        type="button"
        @click="starTimer()"
        color="primary"
        flat
        class="q-ml-sm"
      />
      <q-btn
        label="Get trend and send"
        type="button"
        @click="getTweetsAndPostIt(1)"
        color="primary"
        class="q-ml-sm"
      />
      <q-btn
        label="Get trend"
        type="button"
        @click="getTweetsAndPostIt(1, false)"
        color="primary"
        class="q-ml-sm"
      />
    </div>

    <div
      class="q-table__container q-table--horizontal-separator column no-wrap q-table__card q-table--no-wrap q-mt-md"
    >
      <table class="q-table">
        <tr class="q-table__top" style="font-weight: bolder">
          <td>Id</td>
          <td>Username</td>
          <td>Followers</td>
          <td>Following</td>
          <td>Retweet</td>
          <td>Like</td>
          <td>Quote</td>
          <td>Reply</td>
          <td></td>
          <td style="max-width: 200px">Tweet</td>
        </tr>
        <tr v-for="(link, index) in listTweetTrend" :key="index" v-bind="link">
          <td>{{ listTweetTrend[index].id }}</td>
          <td>{{ listTweetTrend[index].user.screen_name }}</td>
          <td>{{ listTweetTrend[index].user.followers_count }}</td>
          <td>{{ listTweetTrend[index].user.friends_count }}</td>
          <td>{{ listTweetTrend[index].retweet_count }}</td>
          <td>{{ listTweetTrend[index].favorite_count }}</td>
          <td>{{ listTweetTrend[index].quote_count }}</td>
          <td>{{ listTweetTrend[index].reply_count }}</td>
          <td>
            <q-btn
              round
              color="deep-orange"
              @click="deleteATweetReposts(index)"
              icon="delete"
            />
            <q-btn
              round
              color="blue"
              @click="sendTweet(listTweetTrend[index])"
              icon="send"
            />
            <q-btn
              round
              color="green"
              @click="addToTrendsToSend(listTweetTrend[index])"
              icon="add"
            />
          </td>
          <td>
            <img
              :src="listTweetTrend[index].extended_entities.media[0].media_url_https"
            />
            <span>
              {{ listTweetTrend[index].text }}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <br /><br /><br />

    <div
      v-if="tweetToSend && tweetToSend.user"
      style="
        background: #42b983;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div
        id="tweet_to_send"
        style="
          padding: 1rem;
          background: #42b983;
          width: 1000px;
          height: 1000px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <img
          :src="tweetToSend?.file_tweet"
          style="max-width: 1000px; max-height: 1000px; width: 100%"
        />
        <!-- <div class="tweet" style="margin: 2rem; min-width: 700px">
          <div class="box">
            <article class="media">
              <div class="media">
                <figure class="image">
                  <img
                    style="border-radius: 50%"
                    width="120px"
                    :src="tweetToSend.user.profile_image_url_https"
                  />
                </figure>
              </div>
              <div class="media-content w100" style="font-size: 1.5rem">
                <div class="content">
                  <p>
                    <strong class="q-mr-sm">{{ tweetToSend.user.name }}</strong>
                    <small>@{{ tweetToSend.user.screen_name }}</small>
                  </p>
                  <p>
                    {{ tweetToSend.text }}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
var doc = document;
import { useQuasar } from "quasar";
import { Vue, prop } from "vue-class-component";
import { Todo, Meta } from "./models";
declare var html2canvas: any;
var ht: any = html2canvas;
class Props {
  readonly title!: string;
  readonly todos = prop<Todo[]>({ default: () => [] });
  readonly meta!: Meta;
  readonly active!: boolean;
}

export default class ClassComponent extends Vue.with(Props) {
  clickCount = 0;
  accept = false;
  file: any;
  $q = useQuasar();
  tweet: string = "";
  startedTweet = false;

  reposts: string[] = [];

  listTweetTrend: any = [];
  listTweetTrendToSend: any = [];
  ID_TWITTER = "francupen";

  instagramPost = false;
  instagramReel = false;
  twitterPost = false;

  tweetToSend: any = {};

  days = [];
  time = "12:00";
  events: any[] = [];
  rows: any = [];
  columns = [
    {
      name: "tweet_id",
      required: true,
      label: "Delete",
      align: "left",
      field: (row: any) => row.tweet_id,
    },
    {
      name: "send",
      required: true,
      label: "Send",
      align: "left",
      field: (row: any) => row.tweet_id,
    },
    {
      name: "Tweet",
      required: true,
      label: "Tweet",
      align: "left",
    },
    {
      name: "IGPost",
      required: true,
      label: "IG Post",
      align: "left",
    },
    {
      name: "IGStory",
      required: true,
      label: "IG Story",
      align: "left",
    },
    {
      name: "tweet",
      required: true,
      label: "Tweet",
      align: "left",
      field: (row: any) => row.tweet,
      format: (val: any) => `${val}`,
      sortable: true,
    },
    {
      name: "date",
      align: "center",
      label: "date",
      field: "date",
      sortable: true,
    },
    {
      name: "qdate",
      align: "center",
      label: "qdate",
      field: "qdate",
      sortable: true,
    },
    {
      name: "qtime",
      align: "center",
      label: "qtime",
      field: "qtime",
      sortable: true,
    },
  ];

  optionsFn(date: any) {
    return true; //new Date(date).getTime() >= new Date().getTime();
  }
  increment() {
    this.clickCount += 1;
  }
  onReset() {
    this.tweet = "";
  }
  refreshData(props: any) {
    setTimeout(() => {
      const row: any = props.row;
      const rowIndex: number = props.rowIndex;
      // this.events[rowIndex] = row.date;
      this._update("api", "/tweets/" + rowIndex, {
        ...row,
        date: this.formatAllDate(row.qdate, row.qtime),
      }).then((d) => {
        this.events = [];
        d.tweets.forEach((t: any) => {
          this.events.push(t.qdate);
        });
        this.rows = d.tweets;
      });
    }, 100);
  }
  deleteTweet(props: any) {
    const rowIndex: number = props.rowIndex;
    this.events.splice(rowIndex, 1);
    this.rows.splice(rowIndex, 1);

    this._delete("twitter", "/job/" + rowIndex).then((d) => {
      this.events = [];
      d.forEach((t: any) => {
        this.events.push(t.qdate);
      });
      this.rows = d;
      this.showNotif(props.row.tweet);
    });
  }

  showNotif(tweet: string) {
    this.$q.notify({
      message: "Deleted - " + tweet,
      color: "negative",
    });
  }
  formatDate(date: any) {
    let d = date.split("/").join("-");
    let h = this.time.split(":")[0];
    let m = this.time.split(":")[1];
    return new Date(`${d}T${h}:${m}:00.000Z`).toISOString();
  }
  formatAllDate(date: any, time: any) {
    let res = "";
    try {
      let d = date.split("/").join("-");
      let h = time.split(":")[0];
      let m = time.split(":")[1];
      res = new Date(`${d}T${h}:${m}:00.000Z`).toISOString();
    } catch (error) {}
    return res;
  }

  onSubmit() {
    let rows: any = [];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.days.forEach((day) => {
          rows.unshift({
            tweet_id: new Date().getTime(),
            tweet: this.tweet,
            date: this.formatDate(day),
            qdate: day,
            qtime: this.time,
            file: this.file ? reader.result : null,
            type: {
              instagramPost: this.instagramPost,
              instagramReel: this.instagramReel,
              twitterPost: this.twitterPost,
            },
          });
        });
        this.days = [];
        this.time = "12:00";
        this.tweet = "";
        this._post("twitter", "/job/add", rows).then((d) => {
          this.events = [];
          d.forEach((t: any) => {
            this.events.push(t.qdate);
          });
          this.rows = d;
        });
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    } else {
      this.days.forEach((day) => {
        rows.unshift({
          tweet_id: new Date().getTime(),
          tweet: this.tweet,
          date: this.formatDate(day),
          qdate: day,
          qtime: this.time,
          type: {
            instagramPost: this.instagramPost,
            instagramReel: this.instagramReel,
            twitterPost: this.twitterPost,
          },
        });
      });
      this.days = [];
      this.time = "12:00";
      this.tweet = "";
      this._post("twitter", "/job/add", rows).then((d) => {
        this.events = [];
        d.forEach((t: any) => {
          this.events.push(t.qdate);
        });
        this.rows = d;
      });
    }
  }

  refreshTweets() {
    this._get("twitter", "/job/get").then((d) => {
      d.forEach((t: any) => {
        this.events.push(t.qdate);
      });
      this.rows = d;
    });
  }
  created() {
    this.refreshTweets();
    this.getJobsTrends();
  }
  starTimer() {
    let timer: any;
    let timerReposts: any;

    if (!this.startedTweet) {
      // idTimerRepost = !idTimerRepost ? 0 : Number(idTimerRepost);
      timerReposts = setInterval(() => {
        // CHECK TRENDS
        this.getTweetsAndPostIt(1);
      }, 1000 * 60 * 3);
    } else {
      clearInterval(timerReposts);
    }
    if (!this.startedTweet) {
      this.startedTweet = true;
      timer = setInterval(() => {
        // CHECK JOBS
        this.getTweetsAndPostIt(2);
      }, 10000);
    } else {
      this.startedTweet = false;
      clearInterval(timer);
    }
  }
  getTweetsAndPostIt(part = 0, send = true) {
    const timezone = 1000 * 60 * 60;
    if (part === 1) {
      // this._get("twitter", "/repost/accounts").then((d) => {
      //   console.log(d);
      //   this.reposts = d;
      //   if (!d[idTimerRepost]) {
      //     idTimerRepost = 0;
      //   }
      //   const currentRepost = d[idTimerRepost];
      //   console.log(currentRepost);
      //   this._get("twitter", "/repost/tweets/" + currentRepost).then((d) => {
      //     console.log(d);
      //     this.listTweetStrem = d;
      //     this.sendTweet(d[0]);
      //   });
      // });
      this._get("twitter", "/repost/tweets/" + 1).then((d) => {
        const tws_filter = d.filter(
          (tw: any) =>
            tw.extended_entities &&
            tw.extended_entities.media &&
            tw.extended_entities.media.length > 0 &&
            !tw.retweeted_status &&
            !tw.truncated &&
            !tw.is_quote_status &&
            tw.text.includes("https://t.co/")
        );
        this.listTweetTrend = tws_filter;
        console.log(tws_filter);
        let max = -Infinity;
        let maxTweet: any = {};
        tws_filter.forEach((dd: any) => {
          if (dd.user.followers_count > max) {
            max = dd.user.followers_count;
            maxTweet = dd;
          }
        });
        if (send) {
          // this.sendTweet(maxTweet);
        }
      });
    }
    if (part === 2) {
      // REVISAR LOS JOBS PENDIENTES
      this.rows.forEach((t: any, i: number) => {
        const left = new Date(t.date).getTime() - new Date().getTime() - timezone;
        if (left < 0 && left + 1000 * 60 * 10 > 0) {
          if (t.file) {
            var formData = new FormData();
            formData.append("tweet", t.tweet);
            formData.append("altText", t.tweet);
            // HTML file input user's choice...
            formData.append("media_data", t.file);
            var request = new XMLHttpRequest();
            request.open("POST", "http://localhost:3000/twitter/media");
            request.onreadystatechange = () => {
              if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                this.deleteTweet({ rowIndex: i, row: { tweet: t.tweet } });
              }
            };
            if (send) {
              request.send(formData);
            }
            var formData2 = new FormData();
            formData2.append("tweet", t.tweet);
            formData2.append("media_data", t.file);
            var request2 = new XMLHttpRequest();
            request2.open("POST", "http://localhost:3001/instagram/post-photo");
            request2.onreadystatechange = () => {
              if (
                request2.readyState === XMLHttpRequest.DONE &&
                request2.status === 200
              ) {
                // SUCCESS
              }
            };
            if (send) {
              request2.send(formData2);
            }
            this.deleteTweet({ rowIndex: i, row: { tweet: t.tweet } });
          } else {
            this._post("twitter", "", { tweet: t.tweet }).then((d) => {
              this.deleteTweet({ rowIndex: i, row: { tweet: t.tweet } });
            });
          }
        }
      });
      // this.getReposts();
    }
  }

  addToTrendsToSend(tweet: any) {
    this.listTweetTrendToSend.push(tweet);
    this._post("twitter", "/jobtrend/add", [tweet]).then((d) => {
      this.listTweetTrendToSend = d;
    });
  }
  removeToTrendsToSend(i: any) {
    this._delete("twitter", "/jobtrend/" + i).then((d) => {
      this.listTweetTrendToSend = d;
    });
  }
  getJobsTrends() {
    this._get("twitter", "/jobtrend/get").then((d) => {
      this.listTweetTrendToSend = d;
    });
  }
  trendsToSend() {
    setInterval(() => {
      // CHECK JOBS
      const send = this.listTweetTrendToSend.splice(0, 1);
      if (send && send[0]) {
        this.sendTweet(send[0]);
        this.removeToTrendsToSend(0);
      }
    }, 10000);
  }
  formatSend(maxTweet: any, dd: any) {
    maxTweet.file_tweet = dd.extended_entities.media[0].media_url_https;
    maxTweet.text_bk = maxTweet.text;
    maxTweet.text =
      "#NFT #NFTs #NFTCommunity #NFTGiveaway #NFTdrop #nftart #ETH #opensea #like #RT #follow #trend " +
      ("https://t.co/" + dd.text.split("https://t.co/")[1]);
    return maxTweet;
  }
  submit(t: any, networks = ["twitter", "ig_post", "ig_story"]) {
    if (t.file) {
      if (networks.includes("twitter")) {
        var formData = new FormData();
        formData.append("tweet", t.tweet);
        formData.append("altText", t.tweet);
        // HTML file input user's choice...
        formData.append("media_data", t.file);
        var request = new XMLHttpRequest();
        request.open("POST", "http://localhost:3000/twitter/media");
        request.onreadystatechange = () => {
          if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            // this.deleteTweet({ rowIndex: i, row: { tweet: t.tweet } });
          }
        };
        request.send(formData);
      }

      if (networks.includes("ig_post")) {
        var formDataIG = new FormData();
        formDataIG.append("tweet", t.tweet);
        formDataIG.append("media_data", t.file);
        var requestIG = new XMLHttpRequest();
        requestIG.open("POST", "http://localhost:3001/instagram/post-photo");
        requestIG.onreadystatechange = () => {
          if (requestIG.readyState === XMLHttpRequest.DONE && requestIG.status === 200) {
            // SUCCESS
          }
        };
        requestIG.send(formDataIG);
      }

      if (networks.includes("ig_story")) {
        var formDataSTORIES = new FormData();
        formDataSTORIES.append("tweet", t.tweet);
        formDataSTORIES.append("media_data", t.file);
        var requestSTORIES = new XMLHttpRequest();
        requestSTORIES.open("POST", "http://localhost:3001/instagram/post-story");
        requestSTORIES.onreadystatechange = () => {
          if (
            requestSTORIES.readyState === XMLHttpRequest.DONE &&
            requestSTORIES.status === 200
          ) {
            // SUCCESS
          }
        };
        requestSTORIES.send(formDataSTORIES);
      }
    } else {
      if (networks.includes("twitter")) {
        this._post("twitter", "", { tweet: t.tweet }).then((d) => {
          // this.deleteTweet({ rowIndex: i, row: { tweet: t.tweet } });
        });
      }
    }
  }

  sendTweet(tweet: any) {
    tweet = this.formatSend(tweet, tweet);
    this.tweetToSend = tweet;
    this.submit(
      {
        // file: data,
        tweet: tweet.text,
      },
      ["twitter"]
    );
    setTimeout(() => {
      ht(document.querySelector("#tweet_to_send"), {
        letterRendering: 1,
        allowTaint: false,
        foreignObjectRendering: true,
        useCORS: true,
        scale: 2,
        width: 1000,
        height: 1000,
        onrendered: (canvas: any) => {
          // document.body.appendChild(canvas);
          var data = canvas.toDataURL("image/jpeg");
          // console.log(data);
          this.submit(
            {
              file: data,
              tweet: tweet.text + " " + tweet.text_bk,
            },
            ["ig_post"]
          );
        },
      }).then((canvas: any) => {});
    }, 100);
  }

  getReposts() {
    // this._get("twitter", "/repost/" + "gamesandartsnft").then((d) => {
    //   console.log(d);
    // });
    this._get("twitter", "/repost/accounts").then((d) => {
      // console.log(d);
      this.reposts = d;
    });
  }
  setReposts(id: any) {
    this._post("twitter", "/repost/accounts", { id }).then((d) => {
      // console.log(d);
      this.reposts = d;
    });
  }
  deleteARepost(name: string) {
    this._delete("twitter", "/repost/accounts/" + name).then((d) => {
      // console.log(d);
      this.reposts = d;
    });
  }

  getTweetReposts(id: string) {
    this._get("twitter", "/repost/tweets/" + id).then((d) => {
      // console.log(d);
      this.listTweetTrend = d;
    });
  }
  deleteATweetReposts(id: number) {
    this._delete("twitter", "/repost/tweets/" + id).then((d) => {
      // console.log(d);
      this.listTweetTrend = d;
    });
  }

  async _get(url = "api", path = "") {
    return await fetch("http://localhost:3000/" + url + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  }
  async _post(url = "api", path = "", body: any) {
    return await fetch("http://localhost:3000/" + url + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
  async _delete(url = "api", path = "") {
    return await fetch("http://localhost:3000/" + url + path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  }
  async _update(url = "api", path = "", body: any) {
    return await fetch("http://localhost:3000/" + url + path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
  async _postIG(url = "api", path = "", body: any) {
    return await fetch("http://localhost:3001/" + url + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}
</script>
<style>
.w100 {
  width: 100%;
}
.flex {
  display: flex;
}

.tweet {
  background-color: #fff;
  color: #373737;
  box-shadow: 0 2px 3px 3px rgba(10, 10, 10, 0.25), 0 0 0 1px rgba(10, 10, 10, 0.1);
  padding: 30px;
}
.media {
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  width: 120px;
  margin-right: 15px;
}
small {
  font-size: 14px;
  color: #657786;
}
</style>
