<template>
  <div class="side-bar__container">
    <div v-for="tab in tabs" class="side-bar__tab" @click="handleTabClick(tab)">
      {{ tab.name }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "SideBar",
  props: {
    tabs: {
      type: Array,
    },
  },
  methods: {
    handleTabClick(link: any) {
      this.$router.push(link.routeLink);
    },
  },
};
</script>

<style scoped>
.side-bar__container {
  font-family: var(--font-medium);
  display: flex;
  gap: 8px;
}

.side-bar__tab {
  text-decoration: none;
  color: var(--color-foreground3);
}
</style>
