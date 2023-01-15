import Button, { EButtonAppearance } from "../Button.vue";
import { mount } from "@vue/test-utils";
import { test, expect, it } from "vitest/browser";

test("Button component tests", () => {
  it("should mount default appearance", async () => {
    expect(Button).toBeTruthy();

    const wrapper = mount(Button);
    expect(wrapper.classes()).toContain(EButtonAppearance.PRIMARY);
  });

  it("should mount appearance from prop", async () => {
    expect(Button).toBeTruthy();

    const wrapper = mount(Button, {
      props: {
        appearance: EButtonAppearance.OUTLINED,
      },
    });
    expect(wrapper.classes()).toContain(EButtonAppearance.OUTLINED);
  });

  it("should mount slot content", async () => {
    expect(Button).toBeTruthy();

    const buttonText = "Button text";

    const wrapper = mount(Button, {
      slots: {
        default: buttonText,
      },
    });

    expect(wrapper.text()).toContain(buttonText);
  });

  it("should emit custom event on click", async () => {
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
