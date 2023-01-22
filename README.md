# Stocks monitoring app

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
that they are not able to subscribe to new stocks or see data updates of the ones they are already
subscribed to.
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
the ISIN the user types and return if it's already on the list. But even if this logic was not implemented, as I can
judge from the WebSocket behaviour, subscribing to the same ISIN multiple times does not produce duplicating events,
so the performance would not be at stake, it would only be a problem on front-end and the user would see duplicate stocks
in his list.
```

3. What potential performance issues might you face when this app scales with multiple subscriptions?
   How would you improve the speed and user experience?

```text
A straightforward problem that comes to my mind is the problem with rendering large amounts of rapidly changing data: this can happen if a user has so many subscriptions
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

Here I give some reasoning behind my decisions and explain features that I implemented.

### Tests

In my current project we use Jest for unit and integration tests, but here I decided to use Vitest, because
it's an official recommended testing library maintained by the same team as Vue and Vite. It's fast and better optimised
in combination with Vite. Moreover, the syntax and API is pretty much the same as Jest, so it was pretty convenient to use
Vitest.

I wrote unit tests for `useWebSocket` composable to test the main business logic of this app – connecting and operating with
a WebSocket and processing the data from incoming events. To mock a WebSocket connection I used `mock-socket` library.
After looking at other libraries this looked like the most concise way to mock a WebSocket. I included several positive
and negative cases, but of course there could be more.

In my opinion it's important to cover UI components with tests, so I wrote tests for the Button component since it's the
most complex UI component in this app. The Button has many appearances, and I thought it was important to test that its
public interface (props and slots) works correctly. In my experience it's very important to test that when a change is
made in a UI component that is used widely across the whole project it does not break this component, because regressing
it manually is a tough job. So such components as Buttons and Inputs are important candidates to be tested.

**If I had more time to continue development**: I would cover more components with tests, probably separated some logic from
App.vue into more atomic components and wrote some integrations tests. For example, ISIN subscription form's components
(input + button) have logic which depend on one another and this can be tested as wel.

### Components

In the `components` folder there are both UI and business component. I would separate them and kept UI in one place
(like a UI library) and business in another. In my case I have 3 UI components (Button, Input and Notification) and 2
business components. Header just holds the icon of the app, but still it's not a reusable UI component, and you can't
customize it, so it just holds a very simple specific business logic of displaying the logo. Stock card component is
used to display relevant subscription data and perform actions with a subscription. If the app had many features I would
place the components in the corresponding feature directories, but since the app is very simple I didn't want to
overcomplicate the structure.

**If I had more time to continue development**:

1. I would add error state to the Input – it can be used to display validation if the user types in incorrect ISIN format
   or an ISIN to which they already subscribed.
2. Notification: more states could be implemented, such as error or success, but for this task I needed only warning,
   so I omitted other states.
3. Stock: I would add ask and bid display, currency display, but since we don't get the information about the currency
   from the current interface of events I didn't assume any currency and just displayed a number. I also disable "Watch"
   button when the connection to the WebSocket terminates, but last minute I understood that I forgot to disable "Unsubscribe"
   button which can be misleading to the user, so is't a valid improvement :)

### Composables

As I've said in the [Tests](#tests) section `useWebSocket` composable contains the main business logic of this app.
It provides the means to connect and close the connection to the WebSocket, subscribe to and unsubscribe from an ISIN,
process the event from the socket and form them in a data structure which can be then used to display the data to the user.
I used a WebSocket subject from rxjs.

`useScreenWidth` composable was first defined in Stock component, but then I thought that it is a logic that
can be reused across different features, so I decided to make it into a composable.

### Utils

I like to keep global constants in a separate place, so I created a file for them. Utils is a module that can store
many more useful things such as helpers or configs.

### App.vue

App.vue is the heart of my application. Everything unites and happens here. Since the app has a very small set of
features I did not create any pages or navigation and decided to keep it simple and just put everything in this file.
It's not very cluttered since in uses components and composables with isolated logic.

### Styling

I added my own css variables to [index.css](./src/index.css). Those include colors I used (I followed the system
you provided by defining variations of color by changing the alpha-channel), font constants and some other values
I reused multiple times and that I thought can be used as theme values. So it's very simple to change a "theme" of the app
by just changing the variables. I made two views of the application: mobile (screen width 480 px and less) and desktop
(everything else). If I had more time I would do a tablet view as well.

### Extra

I added eslint and prettier packages to the project because I think that consistent code style and automated linting
rules! I can't imagine working in a team and not having a linter on pre-commit, and I know the pain of linting a
big project from scratch, so it's better to have it from the beginning. I ran my linter manually, but if I had more time
I would add a pre-commit hook to do this all automatically.

I used git to version control my project.

I currently work with Vue 2 + Webpack, so it was very exciting to do a project on Vue 3 + Vite setup. I've read and
heard many positive reviews about Vue 3 features and Vite as a lightning fast bundler, so it was super fun. At work, we
currently prepare our project for the migration to Vue 3, so I've got a sneak peek on the new features that I was so eager
to try.
