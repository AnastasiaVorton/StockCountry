<template>
  <div class="stock__container">
    <div class="stock__data" v-if="isMobile">
      <div class="stock__data__item">
        <div class="stock__isin">{{ isin }}</div>
        {{ price }}
      </div>
    </div>
    <div class="stock__data" v-else>
      <div class="stock__data__item">
        <div class="stock__isin">ISIN</div>
        {{ isin }}
      </div>
      <div class="stock__delimiter"></div>
      <div>
        <div class="stock__isin">Price</div>
        {{ price }}
      </div>
    </div>
    <Button
      @buttonClick="$emit('unsubscribe', isin)"
      appearance="secondary"
      class="stock__button"
      >Unsubscribe</Button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "./Button.vue";

export default defineComponent({
  name: "Stock",
  components: {
    Button,
  },
  props: {
    isin: String,
    price: Number,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    isMobile(): boolean {
      return this.windowWidth <= 640;
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
});
</script>

<style scoped>
.stock__container {
  display: flex;
  align-items: flex-end;
  padding: 12px;
  gap: 24px;
  background-color: var(--color-background7);
  border-radius: 12px;
  justify-content: space-between;
  max-width: var(--max-width);
  min-width: 328px;
  width: 100%;
}

.stock__data {
  display: flex;
  align-items: center;
  padding: 0;
  gap: 36px;
  height: 40px;
  line-height: 19px;
}

.stock__data__item {
  width: 115px;
}

.stock__isin {
  color: var(--color-text-placeholder);
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 4px;
}

.stock__delimiter {
  width: 2px;
  height: 35px;
  background: var(--color-primary-gray1);
  border-radius: 2px;
}

.stock__button {
  align-self: flex-end;
}
</style>
