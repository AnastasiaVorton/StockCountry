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
    <Button @buttonClick="closeWS" :disabled="!isISINValid">Close ws</Button>
  </div>
  <div class="watch-list__container">
    <p>My watch list:</p>
    <Card v-if="watchList.length && !isWebSocketConnected">
      The WebSocket from which the data was appearing has been closed, so the
      numbers are not up to date now. Try refreshing the tab and if the problem
      persists contact our support
    </Card>
    <Stock
      v-for="(sub, index) in watchList"
      :key="`subscription-${sub.isin}-${index}`"
      :isin="sub.isin"
      :price="sub.price"
      @unsubscribe="unsubscribe"
    >
      {{ sub }}
    </Stock>
  </div>
</template>

<script lang="ts">
import TextField from "../components/TextField.vue";
import Stock from "../components/Stock.vue";

import Button from "../components/Button.vue";
import Card from "../components/Card.vue";

import { defineComponent } from "vue";

interface IStock {
  isin: String;
  price: number;
}

const ISIN_LENGTH = 12;
const WEB_SOCKET_CLOSED_STATE = 3;
const ISIN_REGEX = new RegExp(/[a-zA-Z]{2}[a-zA-Z0-9]{9}\d/);

export default defineComponent({
  name: "Search",
  components: {
    TextField,
    Button,
    Stock,
    Card,
  },
  data() {
    return {
      ISIN_LENGTH,
      isin: "",
      connection: null as WebSocket | null,
      watchList: [] as IStock[],
      isWebSocketConnected: true,
    };
  },
  computed: {
    isISINValid(): boolean {
      return this.isin.length === ISIN_LENGTH && ISIN_REGEX.test(this.isin);
    },
  },
  methods: {
    subscribe() {
      if (this.watchList.some((value) => value.isin === this.isin)) {
        // todo alert that already subscribed
        return;
      }

      const message = JSON.stringify({
        subscribe: this.isin,
      });

      this.connection?.send(message);

      this.watchList.push({ isin: this.isin, price: 0 });
    },
    parseData(data: any) {
      const parsed: IStock = JSON.parse(data);

      const stock = this.watchList.find((value) => value.isin === parsed.isin);

      if (stock) {
        stock.price = parsed.price;
      }
    },
    unsubscribe(isin: string) {
      const listEntryIndex = this.watchList.findIndex(
        (value) => value.isin === isin
      );

      const message = JSON.stringify({
        unsubscribe: isin,
      });

      this.connection?.send(message);

      this.watchList.splice(listEntryIndex, 1);
    },
    closeWS() {
      this.connection?.close();
    },
  },
  created() {
    console.warn("Starting connection to WebSocket Server");
    this.connection = new WebSocket("ws://localhost:8425/");

    this.connection.onmessage = (event) => {
      console.warn("look, I got something from server");
      console.warn(event.data);

      if (event.data) {
        this.parseData(event.data);
      }
    };
    this.connection.onopen = (event) => {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
      this.isWebSocketConnected = true;
    };
    this.connection.onclose = (event) => {
      console.log(event);
      console.log("WS disconnected");
      this.isWebSocketConnected = false;
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
