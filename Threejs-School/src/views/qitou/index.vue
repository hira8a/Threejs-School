<template>
    <canvas ref="cvas" class="qitouMap"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { useStore } from '@/store/index';
import Load from '@/case/qitou/model_Load';
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Cloud from '@/utils/Cloud';
import RainDrop from '@/utils/RainDrop';
import { CollisionController } from '@/utils/octreeCollision';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import AnimatCamera from "@/engine/AnimatCamera";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { type } from 'os';

const store = useStore();
const cvas = ref<any>(null);

type effect = {
    turbidity: number,
    rayleigh: number,
    mieCoefficient: number,
    mieDirectionalG: number,
    elevation: number,
    azimuth: number,
    exposure: number
};

onMounted(() => {
    let AnimationId: number = 0;
    let canvas = cvas.value;
    let renderer = new THREE.WebGLRenderer({
        //开启抗锯齿
        antialias: true,
        canvas
    });
    // 设置渲染器宽高
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 渲染器启用阴影
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;

    let scene = new THREE.Scene();
    let camera = new AnimatCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(-80, 60, 0);

    let light = new THREE.AmbientLight(0x404040, 1); // soft white light
    scene.add(light);

    //点光源
    let point = new THREE.PointLight(0xffffff, 1);
    //设置点光源位置，改变光源的位置
    point.position.set(-300, 200, 150);
    point.castShadow = true;
    //设置阴影分辨率
    point.shadow.mapSize.width = 2048;
    point.shadow.mapSize.height = 2048;
    scene.add(point);

    //加载模型
    let modelGroup = new THREE.Group();
    Load(modelGroup);

    // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
    let axisHelper = new THREE.AxesHelper(250);
    scene.add(axisHelper);

    // 添加平面
    const planeGeometry = new THREE.BoxGeometry(150, 0.1, 150);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x778899,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // 设置接收阴影的投影面
    // plane.castShadow = true;
    plane.receiveShadow = true;
    modelGroup.add(plane);
    scene.add(modelGroup);

    // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    let clouds: any = [];
    const rainDrop = new RainDrop();
    let fog: any;
    let cloudGroup = new THREE.Group();

    scene.add(modelGroup);

    function CloudAndRain() {
        //添加云
        for (let i = 0; i < 5; i++) {
            const cloud = new Cloud();

            cloud.setPosition(Math.random() * 10 + 10, Math.random() * 100 + 200, -Math.random() * 40 - 20);
            cloud.setRotation(1.56, -0.12, Math.random() * 360);
            clouds.push(cloud);
            cloudGroup.add(cloud.instance);
        }
        scene.add(cloudGroup);
        //添加雨滴
        if (store.funConfig.weather.rain) {
            scene.add(rainDrop.instance);
        }
        //添加雾
        fog = new THREE.FogExp2(0x1c1c2a, 0.002);
        renderer.setClearColor(fog.color);
        if (store.funConfig.weather.lightning) {
            //点光源修改
            point.color = new THREE.Color(0x062d89);
            point.intensity = 30;
            point.distance = 500;
            point.decay = 1.7;
            point.position.set(200, 300, 100);
            //环境光修改
            light.color = new THREE.Color(0x555555);
            const directionLight = new THREE.DirectionalLight(0xffeedd);
            directionLight.position.set(0, 0, 1);
            scene.add(directionLight);
        }
    }

    function RainAnimate() {
        clouds.forEach((cloud: any) => {
            cloud.animate()
        })

        //rain drop
        if (store.funConfig.weather.rain) {
            rainDrop.animate();
        }

        //lightning
        if (store.funConfig.weather.lightning) {
            if (Math.random() > 0.93 || point.power > 100) {
                if (point.power < 100) {
                    point.position.set(
                        Math.random() * 400,
                        300 + Math.random() * 200,
                        100
                    )
                }
                point.power = 50 + Math.random() * 500
            }
        }
    }

    //早上
    const effectController: effect = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 9,
        azimuth: -70,
        exposure: 0.5
    };

    //中午
    const effectController1: effect = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 1,
        elevation: 90,
        azimuth: -70,
        exposure: 0.5
    };


    //傍晚
    const effectController2: effect = {
        turbidity: 0,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 1,
        elevation: 9,
        azimuth: 110,
        exposure: 0.35
    };

    //阴天
    const effectController3: effect = {
        turbidity: 20,
        rayleigh: 0,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 90,
        azimuth: -70,
        exposure: 0.4
    };

    //雨天
    const effectController4: effect = {
        turbidity: 20,
        rayleigh: 0,
        mieCoefficient: 0.002,
        mieDirectionalG: 0.7,
        elevation: 90,
        azimuth: -70,
        exposure: 0.4
    };

    let sky: any, sun: any;
    function initSky(effectController: effect) {

        // Add Sky
        sky = new Sky();
        sky.scale.setScalar(450000);
        scene.add(sky);

        sun = new THREE.Vector3();


        const uniforms = sky.material.uniforms;
        uniforms['turbidity'].value = effectController.turbidity;
        uniforms['rayleigh'].value = effectController.rayleigh;
        uniforms['mieCoefficient'].value = effectController.mieCoefficient;
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
        const theta = THREE.MathUtils.degToRad(effectController.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        uniforms['sunPosition'].value.copy(sun);

        renderer.toneMappingExposure = effectController.exposure;
        renderer.render(scene, camera);


        // const gui = new GUI();

        // gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
        // gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
        // gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
        // gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
        // gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
        // gui.add(effectController, 'azimuth', - 180, 180, 0.1).onChange(guiChanged);
        // gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

        //guiChanged(effectController);

    }

    //initSky(effectController);

    const playerCollider = new Capsule(new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 0.4, 0), 0.35);
    const player = new CollisionController(camera, canvas, playerCollider, modelGroup);
    if (!store.funConfig.theFirstPerson) {
        // 实例化控制器
        const controls = new OrbitControls(camera, renderer.domElement);
    } else {
        //第一人称
        player.initWorld();
        player.initEventListener();
        //player.clearEventListener();
    }

    function render() {
        if (!store.funConfig.weather.sunny) {
            RainAnimate();
        }
        if (store.funConfig.theFirstPerson) {
            player.update();
        }
        // 渲染场景
        renderer.render(scene, camera);
        // 引擎自动更新渲染器
        AnimationId = requestAnimationFrame(render);
    }
    render();

    watchEffect(() => {
        console.log(store.funConfig)
        if (!store.funConfig.weather.sunny) {
            CloudAndRain();
            point.intensity = 0;
        }
        if (store.funConfig.weather.sunny) {
            scene.remove(cloudGroup);
            point.intensity = 1;
            point.distance = 0;
            point.color = new THREE.Color(0xffffff);
            if (store.funConfig.time.morning) {
                point.position.set(-300, 200, 150);
                initSky(effectController);
            } else if (store.funConfig.time.noon) {
                point.position.set(10, 200, 10);
                initSky(effectController1);
            } else if (store.funConfig.time.afternoon) {
                point.position.set(300, 200, -150);
                initSky(effectController2);
            }
        }
        if(store.funConfig.weather.cloudy) {
            scene.remove(rainDrop.instance);
            initSky(effectController3);
        }
        if(store.funConfig.weather.rain || store.funConfig.weather.lightning) {
            initSky(effectController4);
        }
        //clearScene();
    })

    const clearScene = () => {
        // 关闭引擎自动更新渲染器
        cancelAnimationFrame(AnimationId);
        scene.traverse((child: any) => {
            if (child.material) {
                child.material.dispose();
            }
            if (child.geometry) {
                child.geometry.dispose();
            }
            child = null;
        });

        // 场景中的参数释放清理或者置空等
        renderer.forceContextLoss();
        renderer.dispose();
        scene.remove(modelGroup);
        scene.clear();
        // scene = null;
        // camera = null;
        // controls = null;
        // renderer.domElement = null;
        // renderer = null;
    }

    onBeforeUnmount(() => {
        clearScene();
    })
});


</script>

<style scoped>
.qitouMap {
    z-index: -999;
}
</style>