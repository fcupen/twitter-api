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
          <div class="w100 flex" style="justify-content: space-around">
            <q-date v-model="days" multiple :events="events" :options="optionsFn" />
            <q-time v-model="time" format24h />
          </div>
          <q-file filled v-model="file" label="Filled" />
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            <q-btn
              label="Star Timer"
              type="button"
              @click="starTimer()"
              color="primary"
              flat
              class="q-ml-sm"
            />
            is started: {{ startedTweet }}
          </div>
        </q-form>
      </div>
    </div>
    <q-table
      class="w100"
      title="Tweets"
      :rows="rows"
      :columns="columns"
      row-key="tweet_id"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="tweet_id" :props="props">
            <q-btn round color="deep-orange" @click="deleteTweet(props)" icon="delete" />
            <q-btn
              round
              color="deep-orange"
              @click="submit(props.row, props.rowIndex)"
              icon="send"
            />
          </q-td>
          <q-td key="tweet" :props="props">
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
  </div>
</template>

<script lang="ts">
import { useQuasar } from "quasar";
import { Vue, prop } from "vue-class-component";
import { Todo, Meta } from "./models";
import { computed, ComputedRef } from "vue";

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
      fetch("http://localhost:3000/api/" + rowIndex, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...row,
          date: this.formatAllDate(row.qdate, row.qtime),
        }),
      })
        .then((response) => response.json())
        .then((d) => {
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

    fetch("http://localhost:3000/api/" + rowIndex, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((d) => {
        this.events = [];
        d.tweets.forEach((t: any) => {
          this.events.push(t.qdate);
        });
        this.rows = d.tweets;
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
          });
        });
        this.days = [];
        this.time = "12:00";
        this.tweet = "";
        fetch("http://localhost:3000/api/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rows),
        })
          .then((response) => response.json())
          .then((d) => {
            this.events = [];
            d.tweets.forEach((t: any) => {
              this.events.push(t.qdate);
            });
            this.rows = d.tweets;
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
        });
      });
      this.days = [];
      this.time = "12:00";
      this.tweet = "";
      fetch("http://localhost:3000/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows),
      })
        .then((response) => response.json())
        .then((d) => {
          this.events = [];
          d.tweets.forEach((t: any) => {
            this.events.push(t.qdate);
          });
          this.rows = d.tweets;
        });
    }
  }

  refreshTweets() {
    fetch("http://localhost:3000/api/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((d) => {
        d.tweets.forEach((t: any) => {
          this.events.push(t.qdate);
        });
        this.rows = d.tweets;
      });
  }
  created() {
    this.refreshTweets();
  }
  starTimer() {
    const timezone = 1000 * 60 * 60;
    this.startedTweet = true;
    setInterval(() => {
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
            request.send(formData);

            var formData2 = new FormData();
            formData2.append("tweet", t.tweet);
            formData2.append("media_data", t.file);
            var request2 = new XMLHttpRequest();
            request2.open("POST", "http://localhost:3000/instagram/post-photo");
            request2.onreadystatechange = () => {
              if (
                request2.readyState === XMLHttpRequest.DONE &&
                request2.status === 200
              ) {
                // SUCCESS
              }
            };
            request2.send(formData2);
          } else {
            fetch("http://localhost:3000/twitter", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ tweet: t.tweet }),
            })
              .then((response) => response.json())
              .then((d) => {
                this.deleteTweet({ rowIndex: i, row: { tweet: t.tweet } });
              });
          }
        }
      });
    }, 10000);
  }
  submit(t: any, i: number) {
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
          // this.deleteTweet({ rowIndex: i, row: { tweet: t.tweet } });
        }
      };
      request.send(formData);

      var formDataIG = new FormData();
      formDataIG.append("tweet", t.tweet);
      formDataIG.append("media_data", t.file);
      var requestIG = new XMLHttpRequest();
      requestIG.open("POST", "http://localhost:3000/instagram/post-photo");
      requestIG.onreadystatechange = () => {
        if (requestIG.readyState === XMLHttpRequest.DONE && requestIG.status === 200) {
          // SUCCESS
        }
      };
      requestIG.send(formDataIG);

      var formDataSTORIES = new FormData();
      formDataSTORIES.append("tweet", t.tweet);
      formDataSTORIES.append("media_data", t.file);
      var requestSTORIES = new XMLHttpRequest();
      requestSTORIES.open("POST", "http://localhost:3000/instagram/post-story");
      requestSTORIES.onreadystatechange = () => {
        if (
          requestSTORIES.readyState === XMLHttpRequest.DONE &&
          requestSTORIES.status === 200
        ) {
          // SUCCESS
        }
      };
      requestSTORIES.send(formDataSTORIES);
    } else {
      fetch("http://localhost:3000/twitter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tweet: t.tweet }),
      })
        .then((response) => response.json())
        .then((d) => {
          // this.deleteTweet({ rowIndex: i, row: { tweet: t.tweet } });
        });
    }
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
</style>
