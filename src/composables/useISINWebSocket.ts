import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { ref, reactive, Ref } from "vue";
import { IStock } from "../types";
import { WEB_SOCKET_URL } from "../utils";

interface IISINWebSocketComposable {
  watchList: Ref<IStock[]>;
  webSocket: WebSocketSubject<any>;
  isWebSocketConnected: Ref<boolean>;
  subscribeToIsin(value: string): void;
  unsubscribeFromIsin(value: string): void;
  closeWS(): void;
}

/**
 * Composes the logic of communication with a WebSocket with ISIN data
 */
export function useISINWebSocket(): IISINWebSocketComposable {
  /**
   * WebSocket connection object
   */
  const subject: WebSocketSubject<any> = webSocket(WEB_SOCKET_URL);
  /**
   * List of stocks to which a user subscribed
   */
  const watchList: Ref<IStock[]> = ref([]);
  /**
   * Indicator of a WebSocket connection activity
   */
  const isWebSocketConnected = ref(true);
  /**
   * Reactive copy of watchList property
   */
  const reactiveList = reactive(watchList);

  /**
   * Closes the connection with a WebSocket
   */
  const closeWS = (): void => {
    subject.unsubscribe();
  };

  /**
   * Subscribes to a stock and adds it to users watch list
   * @param {string} value - ISIN of a stock
   */
  const subscribeToIsin = (value: string): void => {
    const watchList = reactiveList.value;

    if (watchList.some((item) => item.isin === value) || subject.closed) {
      // todo alert that already subscribed – possible improvement
      return;
    }

    subject.next({ subscribe: value });
    watchList.push({ isin: value, price: 0 });

    reactiveList.value = watchList;
  };

  /**
   * Updates watch list data with data received from the WebSocket
   * @param {IStock} value - message with stock data from WebSocket
   */
  const updateData = (value: IStock): IStock[] => {
    const stock = reactiveList.value.find((item) => item.isin === value.isin);

    if (stock) {
      stock.price = value.price;
    }

    return reactiveList.value;
  };

  /**
   * Unsubscribes from stock and removes it from users watch list
   * @param {string} value - ISIN of a stock
   */
  const unsubscribeFromIsin = (value: string): void => {
    const listEntryIndex = reactiveList.value.findIndex(
      (item) => item.isin === value
    );

    if (listEntryIndex !== -1 && !subject.closed) {
      subject.next({ unsubscribe: value });

      reactiveList.value.splice(listEntryIndex, 1);
    }
  };

  subject.subscribe({
    next: (event: any): void => {
      reactiveList.value = updateData(event);
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
