import { computed, ComputedRef, Ref, ref } from "vue";

interface IScreenWidth {
  windowWidth: Ref<number>;
  isMobile: ComputedRef<boolean>;
  onResize(): void;
}

export function useScreenWidth(): IScreenWidth {
  const windowWidth = ref(window.innerWidth);
  const isMobile = computed(() => windowWidth.value <= 640);

  const onResize = () => {
    windowWidth.value = window.innerWidth;
  };

  return {
    windowWidth,
    isMobile,
    onResize,
  };
}
