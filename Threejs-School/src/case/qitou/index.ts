import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AnimatCamera from "@/engine/AnimatCamera";
import Load from './model_Load';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Cloud from '@/utils/Cloud';
import RainDrop from '@/utils/RainDrop';
import { tOptions, tWeather } from '@/types/three_type';
import { CollisionController } from '@/utils/octreeCollision';
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

let AnimationId: number = 0;
let renderer: any, scene: any, camera: any, light: any, point: any, modelGroup: any, controls: any;
let sky: any, sun: any;

let weatherOption:tWeather = {
    sunny: true,
    cloudy: false,
    rain: false,
    lightning: false
}

function initSky() {

    // Add Sky
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    sun = new THREE.Vector3();

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 9,
        azimuth: -70,
        exposure: 0.5
    };

    const effectController1 = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 1,
        elevation: 90,
        azimuth: -70,
        exposure: 0.5
    };

    const effectController2 = {
        turbidity: 0,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 1,
        elevation: 9,
        azimuth: 110,
        exposure: 0.35
    };


    function guiChanged() {

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

    }

    const gui = new GUI();

    gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
    gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
    gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
    gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
    gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
    gui.add(effectController, 'azimuth', - 180, 180, 0.1).onChange(guiChanged);
    gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

    guiChanged();

}

export const init = (canvas: HTMLCanvasElement) => {
    // options: tOptions
    renderer = new THREE.WebGLRenderer({
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

    scene = new THREE.Scene();
    camera = new AnimatCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(-80, 60, 0);

    light = new THREE.AmbientLight(0x404040, 1); // soft white light
    scene.add(light);

    //点光源
    point = new THREE.PointLight(0xffffff, 1);
    //设置点光源位置，改变光源的位置
    point.position.set(-300, 200, 150);
    point.castShadow = true;
    //设置阴影分辨率
    point.shadow.mapSize.width = 2048;
    point.shadow.mapSize.height = 2048;
    scene.add(point);

    initSky();

    //加载模型
    modelGroup = new THREE.Group();
    Load(modelGroup);

    // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
    const axisHelper = new THREE.AxesHelper(250);
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

    // 实例化控制器
    controls = new OrbitControls(camera, renderer.domElement);

    // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    console.log(weatherOption);

    CloudAndRain();

    //const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
    //const player = new CollisionController(camera, canvas, playerCollider, modelGroup);
    function render() {
        RainAnimate();
        // 渲染场景
        renderer.render(scene, camera);
        // 引擎自动更新渲染器
        AnimationId = requestAnimationFrame(render);
        //player.update();
    }
    render();
    //console.log(AnimationId);
};

export function run(options: tWeather) {
    //console.log(options);
    weatherOption = options;
}

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
    point.color = new THREE.Color(0xf6f7fa);
    point.intensity = 30;
    point.distance = 500;
    point.decay = 1.7;
    point.position.set(200, 300, 100);
    point.power = 0;
    //环境光修改
    light.color = new THREE.Color(0x555555);
    const directionLight = new THREE.DirectionalLight(0xffeedd);
    directionLight.position.set(0, 0, 1);
    scene.add(directionLight);
}

function RainAnimate() {
    clouds.forEach((cloud: any) => {
        cloud.animate()
    })

    //rain drop
    rainDrop.animate()

    //lightning
    // if (Math.random() > 0.93 || point.power > 100) {
    //     if (point.power < 100) {
    //         point.position.set(
    //             Math.random() * 400,
    //             300 + Math.random() * 200,
    //             100
    //         )
    //     }
    //     point.power = 50 + Math.random() * 500
    // }
}

export const clearScene = () => {
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
    scene = null;
    camera = null;
    controls = null;
    renderer.domElement = null;
    console.log(renderer.info);
    renderer = null;
}