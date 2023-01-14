<template>
  <Card class="stock__container">
    <div>
      <div class="stock__isin">ISIN:</div>
      {{ isin }}
    </div>
    <div>
      <div class="stock__isin">Price:</div>
      {{ price }}
    </div>
    <Button @buttonClick="$emit('unsubscribe', isin)" appearance="secondary">Unsubscribe</Button>
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

<style scoped>
.stock__container {
  display: grid;
  grid-template-columns: auto 50% auto;
}

.stock__isin {
  color: var(--color-text-secondary);
}
</style>
