<template>
  <div :class="['notification__container', status]">
    <div class="notification__content">
      <svg
        v-if="status === ENotificationStatus.WARNING"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V7C11.25 6.58579 11.5858 6.25 12 6.25ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
          fill="#FF9900"
        />
      </svg>
      <slot />
    </div>
    <slot name="button"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

enum ENotificationStatus {
  INFO = "info",
  ERROR = "error", // not implemented, but is a valid future improvement
  WARNING = "warning",
}

export default defineComponent({
  name: "Notification",
  props: {
    status: {
      type: String,
      default: ENotificationStatus.INFO,
    },
  },
  data() {
    return {
      ENotificationStatus,
    };
  },
});
</script>

<style lang="scss">
:root {
  --shadow-card: 0px 2px 8px rgba(0, 0, 0, 0.2);
}

.notification__container {
  padding: 16px;
  border-radius: var(--border-radius-m-2);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;
  font-size: var(--text_body-m-2);
  line-height: 24px;
  background-color: var(--color-info-fill);
  color: var(--color-text-dark-primary);

  &.warning {
    background-color: var(--color-primary-yellow4);
    color: var(--color-text-dark-primary);
  }
}

.notification__content {
  display: flex;
  align-items: flex-start;
  padding: 0;
  gap: 12px;

  svg {
    flex: none;
    flex-grow: 0;
  }
}
</style>
