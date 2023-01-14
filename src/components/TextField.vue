<template>
  <div class="text-field__container">
    <label :for="id" class="text-field__label">{{ label }}</label>
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
  font-size: 16px;
  line-height: 22px;
  border: none;
  border-bottom: 1px solid var(--color-primary-gray4);
  background: transparent;
  color: var(--color-text-primary);
  font-family: inherit;
  transition: 0.2s;

  &__label {
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 4px;
  }

  &:focus {
    outline: none;
    border-color: var(--color-foreground3);
    color: var(--color-foreground3);
  }

  &::placeholder {
    color: var(--color-text-placeholder);
  }
}
</style>
