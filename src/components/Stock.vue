<template>
  <Card>
    <div>ISIN: {{ isin }}</div>
    <div>Price: {{ price }}</div>
    <Button @buttonClick="$emit('unsubscribe', isin)">Unsubscribe</Button>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "./Button.vue";
import Card from "./Card.vue";

export default defineComponent({
  name: "Stock",
  components: {
    Button,
    Card,
  },
  props: {
    isin: String,
    price: Number,
  },
});
</script>

<style scoped></style>
