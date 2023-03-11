<template>
  <el-container class="layout-container-demo">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" :default-active="menuActive" text-color="#fff"
          router @select="selectIndex">
          <menuItem :menu-date="menuArr">
          </menuItem>
        </el-menu>
        <div>
          <div class="display_time">
            <span>当前时段:</span>
            <el-tag class="mx-1" :type="timeType" size="large">{{ timeName }}</el-tag>
          </div>
          <div class="display_time">
            <span>当前天气:</span>
            <el-tag class="mx-1" :type="weatherType" size="large">{{ weatherName }}</el-tag>
          </div>
          <el-select v-model="timeValue" placeholder="时段" size="default" style="padding-bottom: 10px;"
            @change="changeTime">
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="weatherValue" placeholder="天气" size="default" @change="changeWeather"
            style="padding-bottom: 10px;">
            <el-option v-for="item in weatherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="display_time">
          <span>视角切换:</span>
          <el-switch size="large" v-model="viewSwitch" @change="changeView" />
        </div>

      </el-scrollbar>
    </el-aside>

    <el-main>
      <el-scrollbar>
        <router-view></router-view>
      </el-scrollbar>
    </el-main>

  </el-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, toRefs, inject } from 'vue';
import '@/common/iconfont.css';
import menuItem from '@/components/menuItem/index.vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/index';

const router = useRouter();
const store = useStore();
const reload = inject('reload') as Function;

const state = reactive({
  menuActive: router.currentRoute.value.fullPath,
  menuArr: [
    {
      name: "地图",
      path: "/home",
      icon: "iconfont icon-map",
      children: [
        {
          name: "岐头",
          path: "/qitou",
          icon: "iconfont icon-map",
          children: [],
        },
        {
          name: "测试",
          path: "/test",
          icon: "iconfont icon-map",
          children: [],
        }
        ,
        {
          name: "测试",
          path: "/ttk",
          icon: "iconfont icon-map",
          children: [],
        }
      ],
    },
    {
      name: "画廊",
      path: "/gallery",
      icon: "iconfont icon-gallery",
      children: [],
    },
  ],
  timeValue: store.funConfig.timeName,
  weatherValue: store.funConfig.weatherName,
  timeOptions: [
    {
      value: 'success',
      label: '早上',
    },
    {
      value: '',
      label: '中午',
    },
    {
      value: 'warning',
      label: '傍晚',
    },
  ],
  weatherOptions: [
    {
      value: 'danger',
      label: '晴天',
    },
    {
      value: 'info',
      label: '阴天',
    },
    {
      value: 'success',
      label: '雨天',
    },
    {
      value: '',
      label: '雷雨',
    },
  ],
  timeName: store.funConfig.timeName,
  timeType: 'success',
  weatherName: store.funConfig.weatherName,
  weatherType: 'danger',
  viewSwitch: store.funConfig.theFirstPerson
});

const {
  menuArr,
  menuActive,
  timeValue,
  weatherValue,
  weatherOptions,
  timeOptions,
  timeName,
  timeType,
  weatherName,
  weatherType,
  viewSwitch
} = toRefs(state);

onMounted(() => {
  // console.log(store.funConfig.weather);
});

const selectIndex = (active: any) => {
  state.menuActive = active;
}

const changeTime = (value: string) => {
  let timeObj: any = state.timeOptions.find((item) => {
    return item.value == value;
  })
  state.timeName = timeObj.label;
  state.timeType = timeObj.value;
}

const changeWeather = (value: string) => {
  let weatherObj: any = state.weatherOptions.find((item) => {
    return item.value == value;
  });
  store.switchWeather(weatherObj.label);
  state.weatherName = weatherObj.label;
  state.weatherType = weatherObj.value;
  store.num = '0xff0000';
}

const changeView = (value: boolean) => {
  reload();
  store.funConfig.theFirstPerson = value;
}


</script>

<style scoped>
.layout-container-demo .el-aside {
  /* color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8); */
  background-color: #545c64;
  z-index: 1;
}

.layout-container-demo .el-menu {
  border-right: none;

}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

.display_time {
  display: flex;
  /* justify-content: center; */
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-bottom: 10px;
  width: 120px;
  height: 30px;
  color: #fff;
  font-size: 13px;
}
</style>
