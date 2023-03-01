<template>
    <template v-for="(item,index) in menuDate">
        <el-sub-menu :key="index" :index="item.path" v-if="item.children.length > 0">
            <template #title>
                <span :class="item.icon"></span>
                <span>{{ item.name }}</span>
            </template>
            <menuItem :menuDate="item.children"></menuItem>
        </el-sub-menu>
        <el-menu-item v-else :index="item.path">
            <template #title>
                <span :class="item.icon"></span>
                <span>{{ item.name }}</span>
            </template>
        </el-menu-item>
    </template>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from 'vue';

const props = defineProps(["menuDate"]);

const state = reactive({
    menuDate: props.menuDate
})

const {
    menuDate
} = toRefs(state);

onMounted(() => {
    //console.log(state.menuDate)
})


//在template标签上使用v-for，:key="index"不能写在template标签上，因为其标签不会被渲染，会引起循环错误
</script>

<script scoped>
</script>