import WS from "jest-websocket-mock";
import { useWebSocket } from "../useWebSocketComposable";
import { test, beforeEach, afterEach, it, expect } from "vitest";

const MOCK_ISIN = "DE000BASF111";
const MOCK_PRICE = 12.23456;

test("useWebSocket composable", () => {
  let server: any;

  beforeEach(() => {
    server = new WS("ws://localhost:8425/", { jsonProtocol: true });
  });

  afterEach(() => {
    server?.close();
  });

  it("should close websocket", async () => {
    const { webSocket, closeWS, isWebSocketConnected } = useWebSocket();

    await server.connected;

    closeWS();

    expect(webSocket.closed).toBeTruthy();
    expect(isWebSocketConnected).toBeFalsy();
  });

  it("should subscribe to ISIN", async () => {
    const { watchList, subscribeToIsin } = useWebSocket();

    await server.connected;

    subscribeToIsin(MOCK_ISIN);

    expect(
      watchList.value.some((item) => item.isin === "DE000BASF112")
    ).toBeTruthy();
  });

  it("should update data on event", async () => {
    const { watchList, subscribeToIsin } = useWebSocket();

    await server.connected;

    subscribeToIsin(MOCK_ISIN);

    server.send({ isin: MOCK_ISIN, price: MOCK_PRICE });

    const subscription = watchList.value.find(
      (item) => item.isin === MOCK_ISIN
    );

    console.warn(subscription);

    expect(subscription).toBeTruthy();
    expect(subscription?.price).toEqual(MOCK_PRICE);
  });
});
