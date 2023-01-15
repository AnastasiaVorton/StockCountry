import {
  computed,
  ComputedRef,
  nextTick,
  onMounted,
  onUnmounted,
  Ref,
  ref,
} from "vue";

interface IScreenWidth {
  windowWidth: Ref<number>;
  isMobile: ComputedRef<boolean>;
  onResize(): void;
}

/**
 * Composes the logic of defining and resetting window width on screen resize.
 * Can be used in components whose logic differs between platforms
 */
export function useScreenWidth(): IScreenWidth {
  const windowWidth = ref(window.innerWidth);
  const isMobile = computed(() => windowWidth.value <= 640);

  /**
   * Used for window resize event listeners
   */
  const onResize = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(async () => {
    await nextTick(() => {
      window.addEventListener("resize", onResize);
    });
  });

  onUnmounted(async () => {
    window.removeEventListener("resize", onResize);
  });

  return {
    windowWidth,
    isMobile,
    onResize,
  };
}
