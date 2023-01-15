# Frontend Coding Challenge

### submission by Anastasiia Repryntseva

## Setup instructions

I used the provided project setup, so the steps to get the app up and running didn't change

```bash
# npm
npm install

# or yarn
yarn install
```

To run the app and access it by http://localhost:3000 run

```bash
# npm
npm run dev

# or yarn
yarn dev
```

## Answers to questions

1. What happens in case the WebSocket disconnects? How would you go further to keep
   the live data available or inform the user? Please discuss the challenges.

```text
In my app I watch the status of a WebSocket connection and if I detect that it's not connected
any more, I display a notification which informs the user that the connection was terminated and
that they are not able to subscribe to new stocks or see data updated for the ones they are already
subscribed.
If I would take this case further I would implement a reconnection strategy. One way is to re-init
a WebSocket by calling useISINWebSocket with some timeout in the complete callback and if the connection
is established successfully we can automatically subscribe to all of the stocks in users watch list so
that the disconnection can go almost unnoticed for them.
The problem here can appear if we can't reconnect multiple times in a row, than we can properly notify the user
about network troubles.
```

2. What happens if a user adds an instrument multiple times to their list? Please discuss possible challenges and mitigations.

```text
My current implementation prevents the user from subscribing to the same instrument more than one time. In my code I check
the ISIN the user types and and return if it's already on the list. But even if this logic was not implemented, as I can
judge from the WebSocket behaviour, subscribing to the same ISIN multiple times does not produce duplicating events,
so the performance would not be at stake, it would only be a problem on front-end and the user would see duplicate stocks
in his list.
```

3. What potential performance issues might you face when this app scales with multiple subscriptions?
   How would you improve the speed and user experience?

```text
A straightforward problem that comes to my mind is the problem with rendering lange amounts of rapidly changing data: this can happen if a user has so many subscriptions
that the WebSocket server bombs the client with many events on which many reactive updates and re-renders must happen.
One way to face this is to throttle the update rate of the view of the components, say once a second or two (here I would
consult with PM's and business analysts on the acceptable update rate, since it might be crucial for real-time stocks monitoring).
Another problem could appear if the data is not only rapidly updated but we also need to process a lot of data. In this challenge 
we only received 4 fields in one event, but if we get more data and we need to process it into complex data structures we might 
struggle with memory issues. Here comes efficient data structure design.
Another way to solve data management and performance issues is with good UX. We could design the display of the data in such way
that the user can see or subscribe to a limited amount of stocks only. In that way we can update and work only with the stocks
that are visible to the user, and hide the rest of the data under pagination and hold the updates and data processing.
```

## Comments and thoughts