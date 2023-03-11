<template>
  <canvas ref="cvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, watchEffect, reactive, onBeforeUnmount, onBeforeUpdate, inject } from 'vue';
import { init } from '@/case/test';
import { useRouter } from 'vue-router';
import { useStore } from '@/store/index';


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AnimatCamera from "@/engine/AnimatCamera";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cloneModel } from '@/utils/model';
import Cloud from '@/utils/Cloud';
import RainDrop from '@/utils/RainDrop';
import { CollisionController } from '@/utils/octreeCollision';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

const store = useStore();

const router = useRouter();
const cvas = ref<any>(null);
const reload = inject('reload');

const isSceneInitialized = ref(false);
const fristPerson = ref(false);

onMounted(() => {
  let AnimationId: number;

  const canvas = cvas.value
  let renderer = new THREE.WebGLRenderer({
    //开启抗锯齿
    antialias: true,
    canvas
  });

  let scene = new THREE.Scene();
  let camera = new AnimatCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
  let light = new THREE.AmbientLight(0x404040, 2); // soft white light
  const point = new THREE.PointLight(0xffffff, 1);

  // 添加平面
  const planeGeometry = new THREE.BoxGeometry(150, 0.1, 150);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x778899,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // 设置接收阴影的投影面
  // plane.castShadow = true;

  const boxGeometry = new THREE.BoxGeometry(15, 0.5, 15);
  const boxMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);

  let modelGroup = new THREE.Group();

  const bulidLoader1 = new GLTFLoader();
  const bulid1Url = new URL('@/assets/model/house9.glb', import.meta.url).href;
  bulidLoader1.load(bulid1Url, (gltf) => {
    let model = gltf.scene;
    model.scale.set(0.8, 0.5, 1);
    model.position.set(30, 0, -18);
    model.rotateY(Math.PI / 2);
    //遍历子节点，开启每个子节点的阴影模式。
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    //scene.add(model);
    modelGroup.add(model);
    cloneModel(model, modelGroup, 30, 0, 17, 0);
  });

  // 设置渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x000000));
  // 渲染器启用阴影
  renderer.shadowMap.enabled = true;

  camera.rotation.order = 'YXZ';
  camera.position.set(-80, 60, 0);

  scene.add(light);

  plane.receiveShadow = true;
  //点光源

  //设置点光源位置，改变光源的位置
  point.position.set(-300, 200, 150);
  point.castShadow = true;
  //设置阴影分辨率
  point.shadow.mapSize.width = 2048;
  point.shadow.mapSize.height = 2048;
  scene.add(point);


  box.name = 'tiaozhuanTest';



  modelGroup.add(plane);
  modelGroup.add(box);
  //console.log(box.uuid);

  let clouds: any = [];
  const rainDrop = new RainDrop();
  let fog: any;
  let cloudGroup = new THREE.Group();

  scene.add(modelGroup);

  // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });


  function CloudAndRain() {
    //添加云
    for (let i = 0; i < 5; i++) {
      const cloud = new Cloud();

      cloud.setPosition(Math.random() * 10 + 90, 400, Math.random() * 50 - 80);
      cloud.setRotation(1.16, -0.12, Math.random() * 360);
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
    scene.remove(cloudGroup);
    scene.remove(rainDrop.instance);
    scene.clear();
    console.log(renderer.info);
    // scene = null;
    // camera = null;
    // controls = null;
    // renderer.domElement = null;

    // renderer = null;
  }
  const playerCollider = new Capsule(new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 0.4, 0), 0.35);
  const player = new CollisionController(camera, canvas, playerCollider, modelGroup);

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
  

  watchEffect(() => {

    if (!store.funConfig.theFirstPerson) {
      // 实例化控制器
      const controls = new OrbitControls(camera, renderer.domElement);
    } else {
      //第一人称
      player.initWorld();
      player.initEventListener();
      //player.clearEventListener();
    }

    isSceneInitialized.value = true;

    if (!store.funConfig.weather.sunny) {
      CloudAndRain();
      //location.reload();
    }
    if (store.funConfig.weather.sunny || store.funConfig.weather.cloudy) {
      scene.remove(rainDrop.instance);
      if (store.funConfig.weather.sunny) {
        scene.remove(cloudGroup);
      }
    }
    //clearScene();
  })

  render();

  onBeforeUnmount(() => {
    player.clearEventListener();
    clearScene();
  })
})

</script>




<style scoped></style>