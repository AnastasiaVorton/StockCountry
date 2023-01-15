import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import { ref, reactive, Ref } from "vue";
import { IStock } from "../types";

interface IWebSocketComposable {
  watchList: Ref<IStock[]>;
  webSocket: WebSocketSubject<any>;
  isWebSocketConnected: Ref<boolean>;
  subscribeToIsin(value: string): void;
  unsubscribeFromIsin(value: string): void;
  closeWS(): void;
}

export function useWebSocket(): IWebSocketComposable {
  const subject: WebSocketSubject<any> = webSocket("ws://localhost:8425/");
  const watchList: Ref<IStock[]> = ref([]);
  const isWebSocketConnected = ref(true);
  const reactiveList = reactive(watchList);

  const closeWS = (): void => {
    subject.unsubscribe();
  };

  const subscribeToIsin = (value: string): void => {
    const watchList = reactiveList.value;

    if (watchList.some((item) => item.isin === value)) {
      // todo alert that already subscribed
      return;
    }

    subject.next({ subscribe: value });
    watchList.push({ isin: value, price: 0 });

    reactiveList.value = watchList;
  };

  const updateData = (value: IStock): IStock[] => {
    const stock = reactiveList.value.find((item) => item.isin === value.isin);

    if (stock) {
      stock.price = value.price;
    }

    return reactiveList.value;
  };

  const unsubscribeFromIsin = (value: string): void => {
    const listEntryIndex = reactiveList.value.findIndex(
      (item) => item.isin === value
    );

    if (listEntryIndex !== -1) {
      subject.next({ unsubscribe: value });

      reactiveList.value.splice(listEntryIndex, 1);
    }
  };

  subject.subscribe({
    next: (event: any): void => {
      const webSocketResponse: IStock = { ...event };
      reactiveList.value = updateData(webSocketResponse);
    },
    error: (_event): void => {
      isWebSocketConnected.value = false;
    },
    complete: (): void => {
      isWebSocketConnected.value = false;
    },
  });

  return {
    watchList: reactiveList,
    webSocket: subject,
    isWebSocketConnected,
    subscribeToIsin,
    unsubscribeFromIsin,
    closeWS,
  };
}
