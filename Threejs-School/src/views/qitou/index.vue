<template>
    <canvas ref="cvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import init from '@/case/qitou';

const cvas = ref<any>(null);

onMounted(() => {
    init(cvas.value);
})



</script>

<style scoped>

</style>