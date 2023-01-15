import Button, { EButtonAppearance } from "../Button.vue";
import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest/browser";

describe("Button component tests", () => {
  test("should mount default appearance", async () => {
    expect(Button).toBeTruthy();

    const wrapper = mount(Button);
    expect(wrapper.classes()).toContain(EButtonAppearance.PRIMARY);
  });

  test("should mount appearance from prop", async () => {
    expect(Button).toBeTruthy();

    const wrapper = mount(Button, {
      props: {
        appearance: EButtonAppearance.OUTLINED,
      },
    });
    expect(wrapper.classes()).toContain(EButtonAppearance.OUTLINED);
  });

  test("should mount slot content", async () => {
    expect(Button).toBeTruthy();

    const buttonText = "Button text";

    const wrapper = mount(Button, {
      slots: {
        default: buttonText,
      },
    });

    expect(wrapper.text()).toContain(buttonText);
  });

  test("should emit custom event on click", async () => {
    expect(Button).toBeTruthy();

    const buttonText = "Button text";

    const wrapper = mount(Button, {
      slots: {
        default: buttonText,
      },
    });

    await wrapper.get("button").trigger("click")
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().buttonClick).toBeTruthy()
  });
});
