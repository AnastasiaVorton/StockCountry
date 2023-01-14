<template>
  <button :class="['button', appearance]" @click="$emit('buttonClick')">
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

enum EButtonAppearance {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

export default defineComponent({
  name: "Button",
  props: {
    appearance: {
      type: String,
      default: EButtonAppearance.PRIMARY,
    },
  },
});
</script>

<style lang="scss">
.button {
  border: none;
  font-family: inherit;
  line-height: 20px;
  cursor: pointer;
  transition: 0.2s;
  width: max-content;

  .button-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  &.primary {
    background: var(--color-primary-purple4);
    padding: 12px 28px 12px 20px;
    color: var(--color-text-dark-primary);
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
    height: 48px;
  }

  &.primary:hover {
    background: var(--color-primary-purple3);
  }

  &.primary:active {
    background: var(--color-primary-purple2);
  }

  &.secondary {
    background: var(--color-primary-gray4);
    padding: 10px 16px;
    color: var(--color-text-primary);
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    height: 40px;
  }

  &.secondary:hover {
    background: var(--color-primary-gray3);
  }

  &.secondary:active {
    background: var(--color-primary-gray2);
  }

  &:disabled {
    &.primary {
      background: var(--color-primary-purple1);
    }

    &.secondary {
      background: var(--color-primary-gray1);
      color: var(--color-text-primary-disabled);
    }

    cursor: not-allowed;
  }
}

@media only screen and (max-width: 640px) {
  .button {
    &.secondary {
      padding: 10px 12px;
      font-weight: 400;
      line-height: 16px;
      height: 36px;
    }
  }
}
</style>
