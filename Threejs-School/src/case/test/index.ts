import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AnimatCamera from "@/engine/AnimatCamera";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cloneModel } from '@/utils/model';
import Cloud from '@/utils/Cloud';
import RainDrop from '@/utils/RainDrop';

import { text3D } from '@/utils/text3D';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

import { useRouter } from 'vue-router';

const init = (canvas: HTMLCanvasElement) => {
    const renderer = new THREE.WebGLRenderer({
        //开启抗锯齿
        antialias: true,
        canvas
    });
    // 设置渲染器宽高
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    // 渲染器启用阴影
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    const camera = new AnimatCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.rotation.order = 'YXZ';
    camera.position.set(-80, 60, 0);

    const light = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(light);

    // 添加平面
    const planeGeometry = new THREE.BoxGeometry(150, 0.1, 150);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x778899,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // 设置接收阴影的投影面
    // plane.castShadow = true;
    plane.receiveShadow = true;

    //点光源
    const point = new THREE.PointLight(0xffffff, 1);
    //设置点光源位置，改变光源的位置
    point.position.set(-300, 200, 150);
    point.castShadow = true;
    //设置阴影分辨率
    point.shadow.mapSize.width = 2048;
    point.shadow.mapSize.height = 2048;
    scene.add(point);

    const boxGeometry = new THREE.BoxGeometry(15, 0.5, 15);
    const boxMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.name = 'tiaozhuanTest';

    let modelGroup = new THREE.Group();

    modelGroup.add(plane);
    modelGroup.add(box);
    //console.log(box.uuid);


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

    scene.add(modelGroup);
    //console.log(modelGroup);

    // const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
    // const player = new CollisionController(camera, canvas, playerCollider, modelGroup);

    // const fontUrl = new URL('@/assets/fonts/Microsoft_YaHei_Regular.json', import.meta.url).href;
    // const loader = new FontLoader();
    // loader.load(fontUrl, function (response) {
    //     text3D('傻逼',response,modelGroup);
    // });

    // 实例化控制器 
    const controls = new OrbitControls(camera, renderer.domElement);

    // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    const pointer = new THREE.Vector2();
    let selectedObject: any = null;
    const raycaster = new THREE.Raycaster();
    //document.addEventListener('dblclick', onPointerMove);



    // function onPointerMove(event: any) {



    //     pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    //     raycaster.setFromCamera(pointer, camera);

    //     const intersects = raycaster.intersectObject(modelGroup, true);

    //     if (intersects.length > 0) {

    //         const res = intersects.filter(function (res) {

    //             return res && res.object;

    //         })[0];

    //         if (res && res.object) {

    //             selectedObject = res.object;

    //         }

    //     }

    //     if (selectedObject) {

    //         if (selectedObject.name === 'tiaozhuanTest') {
    //             console.log(selectedObject);
    //         }
    //         selectedObject = null;

    //     }

    // }
    const clouds: any = [];
    const rainDrop = new RainDrop();
    let fog: any;

    function CloudAndRain() {
        //添加云
        for (let i = 0; i < 30; i++) {
            const cloud = new Cloud();
            clouds.push(cloud);
            cloud.setPosition(Math.random() * 1000 - 460, 600, Math.random() * 500 - 400);
            cloud.setRotation(1.16, -0.12, Math.random() * 360);
            scene.add(cloud.instance);
        }
        //添加雨滴
        scene.add(rainDrop.instance);
        //添加雾
        fog = new THREE.FogExp2(0x1c1c2a, 0.002);
        renderer.setClearColor(fog.color);
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

    CloudAndRain();

    function RainAnimate() {
        clouds.forEach((cloud: any) => {
            cloud.animate()
        })

        //rain drop
        rainDrop.animate()

        //lightning
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

    function render() {
        RainAnimate();
        // 渲染场景
        renderer.render(scene, camera);
        // 引擎自动更新渲染器
        requestAnimationFrame(render);
        //player.update();
    }
    render();
}

export { init };