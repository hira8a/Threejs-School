import { defineStore } from 'pinia';
import { tOptions } from '@/types/three_type';

export const useStore = defineStore('useStore', {
    state: () => {
        return {
            funConfig: {
                timeName: '早上',
                time: {
                    morning: true,
                    noon: false,
                    afternoon: false
                },
                weatherName: '晴天',
                weather: {
                    sunny: true,
                    cloudy: false,
                    rain: false,
                    lightning: false
                },
                theFirstPerson: false
            } as tOptions,
            num: '0x00ff00'
        }
    }, 
    persist: {
        enabled: true,
        // 自定义持久化参数
        strategies: [
            {
                // 自定义key
                key: 'login_store',
                // 自定义存储方式，默认sessionStorage
                storage: localStorage,
                // 指定要持久化的数据，默认所有 state 都会进行缓存，可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
                //paths: ['curUsername'],
            }
        ]
    },
    actions: {
        switchWeather(label: string) {
            this.funConfig.weatherName = label;
            if (label === '晴天') {
                this.funConfig.weather  = {
                    sunny: true,
                    cloudy: false,
                    rain: false,
                    lightning: false
                };
            };
            if (label === '阴天') {
                this.funConfig.weather = {
                    sunny: false,
                    cloudy: true,
                    rain: false,
                    lightning: false
                };
            };
            if (label === '雨天') {
                this.funConfig.weather = {
                    sunny: false,
                    cloudy: false,
                    rain: true,
                    lightning: false
                };
            };
            if (label === '雷雨') {
                this.funConfig.weather = {
                    sunny: false,
                    cloudy: false,
                    rain: true,
                    lightning: true
                };
            };
        }
    }
});