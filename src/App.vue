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
      <Input
        placeholder="XXXXXXXXXXXX"
        v-model="isin"
        :maxlength="ISIN_LENGTH"
        id="isin_input"
        label="ISIN"
        class="isin__text-field"
        @keyup.enter="subscribe"
      ></Input>
      <Button
        @buttonClick="subscribe"
        :disabled="!isISINValid || !isWebSocketConnected"
      >
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
    </div>
    <Notification
      v-if="!isWebSocketConnected"
      class="space__vertical"
      status="warning"
    >
      <p>
        The WebSocket from which we we receiving the data has been closed, so
        the data may not up to date now and you can't subscribe to new stocks.
        Try refreshing the tab and if the problem persists contact our support
      </p>
      <template #button>
        <Button appearance="outlined" @buttonClick="refreshPage">
          Refresh
        </Button>
      </template>
    </Notification>
    <div class="watch-list__items">
      <Stock
        v-for="(sub, index) in watchList"
        :key="`subscription-${sub.isin}-${index}`"
        :isin="sub.isin"
        :price="sub.price"
        @unsubscribe="unsubscribeFromIsin"
      >
        {{ sub }}
      </Stock>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import Header from "./components/Header.vue";
import Input from "./components/Input.vue";
import Button from "./components/Button.vue";
import Notification from "./components/Notification.vue";

import "./index.css";
import Stock from "./components/Stock.vue";
import { useISINWebSocket } from "./composables/useWebSocketComposable";
import { ISIN_LENGTH, ISIN_REGEX } from "./utils";

export default defineComponent({
  components: {
    Header,
    Input,
    Button,
    Stock,
    Notification,
  },
  data() {
    return {
      ISIN_LENGTH,
      isin: "",
    };
  },
  computed: {
    isISINValid(): boolean {
      return this.isin.length === ISIN_LENGTH && ISIN_REGEX.test(this.isin);
    },
  },
  methods: {
    subscribe() {
      this.subscribeToIsin(this.isin);
    },
    refreshPage() {
      window.location.reload();
    },
  },
  setup() {
    const {
      watchList,
      webSocket,
      subscribeToIsin,
      unsubscribeFromIsin,
      closeWS,
      isWebSocketConnected,
    } = useISINWebSocket();

    onUnmounted(() => closeWS());

    return {
      watchList,
      webSocket,
      subscribeToIsin,
      unsubscribeFromIsin,
      closeWS,
      isWebSocketConnected,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;

  .helper-text {
    color: var(--color-text-secondary);
  }

  .helper-text:not(:first-of-type) {
    margin-top: 12px;
  }

  .isin__container {
    display: flex;
    gap: 32px;
    align-items: end;
    margin-top: 36px;

    .isin__text-field {
      width: 100%;
    }
  }

  .space__vertical {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .watch-list__items {
    margin: 44px 0;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
  }
}

@media only screen and (max-width: 480px) {
  .page_title {
    font-size: var(--text_body-l);
    line-height: 29px;
  }

  .main {
    padding: 0 16px;
  }

  .isin__container {
    margin-top: 32px;
  }
}
</style>
