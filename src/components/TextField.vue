<template>
  <div class="text-field__container">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      class="text-field"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "TextField",
  props: {
    modelValue: String,
    emits: ["update:modelValue"],
    label: String,
    id: String,
    placeholder: String,
    maxlength: Number,
  },
};
</script>

<style lang="scss">
.text-field__container {
  display: flex;
  flex-direction: column;
}

.text-field {
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid var(--color-foreground1);
  background: transparent;
  color: var(--color-foreground3);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--color-foreground3);
    color: var(--color-foreground3);
  }
}
</style>
