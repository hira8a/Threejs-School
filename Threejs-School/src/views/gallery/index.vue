<template>
    <canvas ref="cvas" class="galleryMap"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import init from '@/case/gallery';

const cvas = ref<any>(null);

onMounted(() => {
    init(cvas.value);
})



</script>

<style scoped>
.galleryMap {
    z-index: -1;
}

</style>