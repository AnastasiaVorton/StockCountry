<template>
  <Header />
  <main class="main">
    <h1 class="page_title">Search for assets</h1>
    <p class="helper-text">
      Welcome to the tiny stocks monitoring app!
      <br />
      Here you can search and subscribe to the updates of the stocks of your
      interest.
    </p>
    <p class="helper-text">
      The rules are simple: type an ISIN of an asset you want to add to your
      watch list to the input below and press "Watch"
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
      <Button @buttonClick="subscribe" :disabled="!isISINValid">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.45537 13.2548C6.4668 4.9156 17.533 4.9184 20.5446 13.2549C20.6853 13.6445 21.1152 13.8462 21.5048 13.7055C21.8944 13.5647 22.0961 13.1348 21.9554 12.7453C18.4671 3.08923 5.53324 3.08449 2.04455 12.7453C1.90386 13.1349 2.10563 13.5648 2.49522 13.7055C2.88481 13.8462 3.31469 13.6444 3.45537 13.2548Z"
            fill="#121212"
          />
          <path
            d="M12 17.0001C14.2092 17.0001 16 15.2092 16 13.0001C16 10.7909 14.2092 9.00006 12 9.00006C9.79088 9.00006 8.00002 10.7909 8.00002 13.0001C8.00002 15.2092 9.79088 17.0001 12 17.0001Z"
            fill="#121212"
          />
        </svg>

        Watch</Button
      >
      <Button @buttonClick="closeWS" :disabled="!isISINValid">Close ws</Button>
    </div>
    <div class="watch-list__container">
      <p>My watch list:</p>
      <Card
        v-if="watchList.length && !isWebSocketConnected"
        class="space__vertical"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C17.523 2 22 6.478 22 12C22 17.522 17.523 22 12 22C6.477 22 2 17.522 2 12C2 6.478 6.477 2 12 2ZM12 3.667C7.405 3.667 3.667 7.405 3.667 12C3.667 16.595 7.405 20.333 12 20.333C16.595 20.333 20.333 16.595 20.333 12C20.333 7.405 16.595 3.667 12 3.667ZM11.9987 14.5022C12.5502 14.5022 12.9973 14.9494 12.9973 15.5009C12.9973 16.0524 12.5502 16.4996 11.9987 16.4996C11.4471 16.4996 11 16.0524 11 15.5009C11 14.9494 11.4471 14.5022 11.9987 14.5022ZM11.9945 7C12.3742 6.9997 12.6882 7.2816 12.7381 7.64764L12.7451 7.7494L12.7487 12.251C12.749 12.6652 12.4135 13.0013 11.9993 13.0016C11.6196 13.0019 11.3055 12.72 11.2556 12.354L11.2487 12.2522L11.2451 7.7506C11.2447 7.33639 11.5802 7.00033 11.9945 7Z"
            fill="#ffc700"
          />
        </svg>
        <div>
          The WebSocket from which we we receiving the data has been closed, so
          the numbers are not up to date now. Try refreshing the tab and if the
          problem persists contact our support
        </div>
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
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/Header.vue";
import TextField from "./components/TextField.vue";
import Card from "./components/Card.vue";
import Button from "./components/Button.vue";

import "./index.css";
import Stock from "./components/Stock.vue";

interface IStock {
  isin: String;
  price: number;
}

const ISIN_LENGTH = 12;
const ISIN_REGEX = new RegExp(/[a-zA-Z]{2}[a-zA-Z0-9]{9}\d/);

export default defineComponent({
  components: {
    Header,
    TextField,
    Card,
    Button,
    Stock,
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
  // beforeDestroy() {
  //   this.connection?.close();
  // },
});
</script>

<style>
#app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

.isin__container {
  display: flex;
  gap: 12px;
  align-items: end;
  margin-top: 36px;
}

.isin__text-field {
  width: 150px;
}

.watch-list__container {
  margin-top: 32px;
}

.space__vertical {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

@media only screen and (max-width: 640px) {
  .watch-list__container {
    display: grid;
    gap: 8px;
  }

  .page_title {
    font-size: 24px;
    line-height: 29px;
  }

  .main {
    padding: 0 16px;
  }

  .isin__container {
    margin-top: 32px;
  }
}

.helper-text {
  color: var(--color-text-secondary);
}

.helper-text:not(:first-of-type) {
  margin-top: 12px;
}
</style>
