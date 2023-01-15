<template>
  <button :class="['button', appearance]" @click="$emit('buttonClick')">
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export enum EButtonAppearance {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  OUTLINED = "outlined",
}

export default defineComponent({
  name: "Button",
  props: {
    /**
     * Appearance mode of the button
     * @type EButtonAppearance
     */
    appearance: {
      type: String as PropType<EButtonAppearance>,
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
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  &.primary {
    background: var(--color-primary-purple4);
    padding: 12px 28px 12px 20px;
    color: var(--color-text-dark-primary);
    font-size: var(--text_body-m);
    font-weight: var(--font-weight-semi-bold);
    border-radius: var(--border-radius-m);
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
    font-size: var(--text_body-s);
    font-weight: var(--font-weight-medium);
    border-radius: var(--border-radius-s);
    height: 40px;
  }

  &.secondary:hover {
    background: var(--color-primary-gray3);
  }

  &.secondary:active {
    background: var(--color-primary-gray2);
  }

  &.outlined {
    border: 1px solid var(--color-primary-gray1);
    background-color: transparent;
    padding: 9px 16px;
    color: var(--color-text-dark-primary);
    font-size: var(--text_body-s);
    font-weight: var(--font-weight-medium);
    line-height: 18px;
    border-radius: var(--border-radius-s);
    height: 36px;
  }

  &.outlined:hover {
    border-color: var(--color-primary-gray3);
  }

  &.outlined:active {
    border-color: var(--color-foreground4);
  }

  &:disabled {
    &.primary {
      background: var(--color-primary-purple1);
    }

    &.secondary {
      background: var(--color-primary-gray1);
      color: var(--color-text-primary-disabled);
    }

    &.outlined {
      color: var(--color-text-dark-primary-disabled);
      border-color: var(--color-primary-gray1);
    }

    cursor: not-allowed;
  }
}

@media only screen and (max-width: 480px) {
  .button {
    &.secondary {
      padding: 10px 12px;
      font-weight: var(--font-weight-regular);
      line-height: 16px;
      height: 36px;
    }
  }
}
</style>
