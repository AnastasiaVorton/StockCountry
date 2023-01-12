<template>
  <h1>Search assets</h1>
  <p>Welcome to the tiny stocks monitoring app!</p>
  <p>
    Here you can search and subscribe for the updates of the stocks of your
    interest.
  </p>
  <p>
    The rules are simple: type an ISIN of an asset you want to watch to the
    input below and press "Watch"
  </p>
  <div class="isin__container">
    <TextField
      placeholder="DE000BASF111"
      v-model="isin"
      :maxlength="ISIN_LENGTH"
      id="isin_input"
      label="ISIN"
      class="isin__text-field"
    ></TextField>
    <Button @buttonClick="subscribe" :disabled="!isISINValid">Watch</Button>
  </div>
  <div class="watch-list__container">
    <p>My watch list:</p>
    <ul>
      <li
        v-for="(sub, index) in watchList"
        :key="`subscription-${sub}-${index}`"
      >
        {{ sub }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import TextField from "../components/TextField.vue";
import Button from "../components/Button.vue";
import { defineComponent } from "vue";

const ISIN_LENGTH = 12;
const ISIN_REGEX = new RegExp(/[a-zA-Z]{2}[a-zA-Z0-9]{9}\d/);

export default defineComponent({
  name: "Search",
  components: {
    TextField,
    Button,
  },
  data() {
    return {
      ISIN_LENGTH,
      isin: "",
      connection: null as WebSocket | null,
      watchList: [] as string[],
    };
  },
  computed: {
    isISINValid() {
      return this.isin.length === ISIN_LENGTH && ISIN_REGEX.test(this.isin);
    },
  },
  methods: {
    subscribe() {
      if (this.watchList.some((value) => value === this.isin)) {
        // todo alert that already subscribed
        return;
      }

      this.watchList.push(this.isin);

      const message = JSON.stringify({
        subscribe: this.isin,
      });

      this.connection?.send(message);
    },
  },
  created() {
    console.warn("Starting connection to WebSocket Server");
    this.connection = new WebSocket("ws://localhost:8425/");

    this.connection.onmessage = function (event) {
      console.warn("look, I got something from server");
      console.warn(event.data);
    };
    this.connection.onopen = function (event) {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
    };
  },
  beforeDestroy() {
    this.connection?.close();
  },
});
</script>

<style scoped>
.isin__container {
  display: flex;
  gap: 12px;
  align-items: end;
  margin-top: 32px;
}

.isin__text-field {
  width: 150px;
}

.watch-list__container {
  margin-top: 32px;
}
</style>
