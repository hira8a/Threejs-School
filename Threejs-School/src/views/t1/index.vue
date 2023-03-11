<template>
    <canvas ref="cvas"></canvas>
</template>
<script setup lang="ts">

import { ref, onMounted, watch, watchEffect, reactive, onBeforeUnmount } from 'vue';
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

const store = useStore();

const router = useRouter();
const cvas = ref<any>(null);

const state = reactive({
    color: 0xff0000,
})

const isSceneInitialized = ref(false)

onMounted(() => {
    const canvas = cvas.value
    let renderer = new THREE.WebGLRenderer({
        //开启抗锯齿
        antialias: true,
        canvas
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    let scene = new THREE.Scene();
    let camera = new AnimatCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    let light = new THREE.AmbientLight(0x404040, 2); // soft white light
    const point = new THREE.PointLight(0xffffff, 1);

    // 设置渲染器宽高
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    // 渲染器启用阴影
    renderer.shadowMap.enabled = true;

    camera.rotation.order = 'YXZ';
    camera.position.set(-80, 60, 0);

    scene.add(light);

    //设置点光源位置，改变光源的位置
    point.position.set(-300, 200, 150);
    point.castShadow = true;
    //设置阴影分辨率
    point.shadow.mapSize.width = 2048;
    point.shadow.mapSize.height = 2048;
    scene.add(point);

    const controls = new OrbitControls(camera, renderer.domElement);
    const Url1 = new URL('@/assets/images/20230305201703.jpg', import.meta.url).href;
    var material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(Url1) //加载一整张纹理图片
    });
    
    // var size = 1000
    // var skyBox = new THREE.Mesh(new THREE.SphereGeometry(size, size, size), material) // 创建一个球体
    // skyBox.geometry.scale(-1, 1, 1) // 里外两侧的表面翻转
    // scene.add(skyBox) // 添加球体到场景中


    const smokeUrl = new URL('@/assets/images/rain/smoke.png', import.meta.url).href;
    const cloudParticles:any = [];
    let flashAnimatation;
    // 闪电乌云特效
    const loadFlash = () => {
        const wholeFlashGroup = new THREE.Group();
        wholeFlashGroup.name = 'flash'
        const ambient = new THREE.AmbientLight(0x555555);
        wholeFlashGroup.add(ambient);
        const directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1);
        wholeFlashGroup.add(directionalLight);
        const flash = new THREE.PointLight(0xe0ffff, 10000, 0, 2);
        flash.position.set(100, 100, -110);
        wholeFlashGroup.add(flash);
        //this.myRef.current.appendChild(renderer.domElement);

        let loader = new THREE.TextureLoader();
        loader.load(smokeUrl, (texture) => {
            const cloudGeo = new THREE.PlaneGeometry(400, 400);
            const cloudMaterial = new THREE.MeshLambertMaterial({//一种用于无光泽表面的材料，没有镜面高光。该材料使用基于非物理的朗伯模型来计算反射率
                map: texture,
                transparent: true
            });
            for (let p = 0; p < 5; p++) {
                let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
                cloud.position.set(
                    Math.random() * 10 + 90,
                    Math.random() * 20 + 15,
                    -Math.random() * 50 - 80
                );
                cloud.rotation.x = 1.16;
                cloud.rotation.y = -0.12;
                cloud.rotation.z = Math.random() * 360;
                cloud.material.opacity = 0.4;
                cloudParticles.push(cloud);
                wholeFlashGroup.add(cloud);
            }
            scene.add(wholeFlashGroup)
            animate();
        });

        

        const animate = () => {
            cloudParticles.forEach(p => { // cloudParticles 是包含 数个乌云Mesh 的数组
                p.rotation.z -= 0.002;
            });
            if (Math.random() > 0.90 || flash.power > 220) {
                if (flash.power < 100)
                    flash.position.set(
                        Math.random() * 30 + 80,
                        Math.random() * 20 + 10,
                        Math.random() * 3 - 100
                    );
                flash.power = 50 + Math.random() * 500;
            }
            flashAnimatation = requestAnimationFrame(animate);
        }
    }

    loadFlash();









    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function render() {
        // 渲染场景
        renderer.render(scene, camera);
        // 引擎自动更新渲染器
        requestAnimationFrame(render);
        //player.update();
    }
    render();
})

</script>
<style scoped></style>