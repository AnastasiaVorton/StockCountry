import { useWebSocket } from "../useWebSocketComposable";
import { beforeEach, it, expect, describe } from "vitest";
import { Server } from "mock-socket";

const MOCK_ISIN = "DE000BASF111";
const MOCK_ISIN_2 = "DE000BASF112";

const MOCK_PRICE = 12.23456;

describe("useWebSocket composable tests", () => {
  let websocketServer: Server;

  beforeEach(() => {
    websocketServer = new Server("ws://localhost:8425/");
    websocketServer.on("connection", (socket) => {
      socket.on("message", () => {
        socket.send(JSON.stringify({ isin: MOCK_ISIN, price: MOCK_PRICE }));
      });
    });
  });

  afterEach(() => {
    websocketServer.close();
  });

  it("should close websocket", async () => {
    const { webSocket, closeWS } = useWebSocket();

    await closeWS();

    expect(webSocket.closed).toBeTruthy();
  });

  it("should subscribe to ISIN", async () => {
    const { watchList, subscribeToIsin } = useWebSocket();

    subscribeToIsin(MOCK_ISIN);

    expect(
      watchList.value.some((item) => item.isin === MOCK_ISIN)
    ).toBeTruthy();
  });

  it("should update data on event", async () => {
    const { watchList, subscribeToIsin } = useWebSocket();

    subscribeToIsin(MOCK_ISIN);

    websocketServer.emit('message', JSON.stringify({ isin: MOCK_ISIN, price: MOCK_PRICE }))

    const subscription = watchList.value.find(
      (item) => item.isin === MOCK_ISIN
    );

    expect(subscription).toBeTruthy();
    expect(subscription?.price).toEqual(MOCK_PRICE);
  });

  it("should not subscribe to the same ISIN twice", async () => {
    const { watchList, subscribeToIsin } = useWebSocket();

    subscribeToIsin(MOCK_ISIN);
    subscribeToIsin(MOCK_ISIN);

    expect(watchList.value.length).toEqual(1);
  });

  it("should add many unique stocks to a list", async () => {
    const { watchList, subscribeToIsin } = useWebSocket();

    subscribeToIsin(MOCK_ISIN);
    subscribeToIsin(MOCK_ISIN_2);

    expect(watchList.value.length).toEqual(2);
  });

  it("should unsubscribe and delete isin", async () => {
    const { watchList, unsubscribeFromIsin, subscribeToIsin } = useWebSocket();

    subscribeToIsin(MOCK_ISIN);
    unsubscribeFromIsin(MOCK_ISIN);

    const subscription = watchList.value.find(
        (item) => item.isin === MOCK_ISIN
    );

    expect(subscription).toEqual(undefined);
  });
});
