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
            :rules="[
              (val) => (val && val.length > 0) || 'Please tweet something',
            ]"
          />
          <div class="w100 flex" style="justify-content: space-around">
            <q-date
              v-model="days"
              multiple
              :events="events"
              :options="optionsFn"
            />
            <q-time v-model="time" format24h />
          </div>
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
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
            <q-btn
              round
              color="deep-orange"
              @click="deleteTweet(props)"
              icon="delete"
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
  $q = useQuasar();
  tweet: string = "";
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
    return new Date(date).getTime() >= new Date().getTime();
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
    let d = date.split("/").join("-");
    let h = time.split(":")[0];
    let m = time.split(":")[1];
    return new Date(`${d}T${h}:${m}:00.000Z`).toISOString();
  }

  onSubmit() {
    let rows: any = [];
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
