<template>
  <router-view v-if="isRouterAlive"></router-view>
</template>

<script setup lang="ts">
import { ref, provide, nextTick } from 'vue';
import { ElLoading } from 'element-plus';

const isRouterAlive = ref(true);

const reload:Function = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  })
  loading.close();
}

provide('reload', reload);

</script>

<style scoped></style>
