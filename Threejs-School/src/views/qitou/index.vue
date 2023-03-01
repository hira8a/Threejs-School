<template>
    <canvas ref="cvas" class="qitouMap"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { ElLoading } from 'element-plus';
import { init, clearScene, run } from '@/case/qitou';
import '@/common/iconfont.css';
import { useStore } from '@/store/index';
import { tOptions } from '@/types/three_type';
const store = useStore();

const cvas = ref<any>(null);

onMounted(() => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    init(cvas.value);
    loading.close();
});

onBeforeUnmount(() => {
    clearScene();
});

const initQitou = (option:tOptions) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    init(cvas.value);
    loading.close();
};

watchEffect(() => {
    run(store.funConfig.weather);
})

</script>

<style scoped>
.qitouMap {
    z-index: -999;
}
</style>