import {
    Mesh,
    Color,
    Scene,
    Vector3,
    WebGLRenderer,
    Raycaster,
    TextureLoader,
    LoadingManager,
    MeshBasicMaterial,
    PlaneGeometry,
    CubeTextureLoader,
    AmbientLight,
    PointLight
} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AnimatCamera from "@/engine/AnimatCamera";

const init = (canvas: HTMLCanvasElement) => {
    const renderer = new WebGLRenderer({
        //开启抗锯齿
        antialias: true,
        canvas
    });
    // 设置渲染器宽高
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 渲染器启用阴影
    renderer.shadowMap.enabled = true;

    const scene = new Scene();
    const camera = new AnimatCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(-20, 20, 20);

    const light = new AmbientLight(0x404040, 2); // soft white light
    scene.add(light);

    //点光源
    const point = new PointLight(0xffffff, 1);
    //设置点光源位置，改变光源的位置
    point.position.set(-300, 200, 150);
    point.castShadow = true;
    //设置阴影分辨率
    point.shadow.mapSize.width = 2048;
    point.shadow.mapSize.height = 2048;
    scene.add(point);

    const imgUrlPx = new URL('@/assets/images/skybox/px.png', import.meta.url).href;
    const imgUrlNx = new URL('@/assets/images/skybox/nx.png', import.meta.url).href;
    const imgUrlPy = new URL('@/assets/images/skybox/py.png', import.meta.url).href;
    const imgUrlNy = new URL('@/assets/images/skybox/ny.png', import.meta.url).href;
    const imgUrlPz = new URL('@/assets/images/skybox/pz.png', import.meta.url).href;
    const imgUrlNz = new URL('@/assets/images/skybox/nz.png', import.meta.url).href;

    //创建天空盒
    const skyBoxUrls = [
        imgUrlPx,
        imgUrlNx,
        imgUrlPy,
        imgUrlNy,
        imgUrlPz,
        imgUrlNz
    ];
    const skyBoxLoader = new CubeTextureLoader();
    scene.background = skyBoxLoader.load(skyBoxUrls);

    // 实例化控制器
    const controls = new OrbitControls(camera, renderer.domElement);

    // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
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
    }
    render();
};

export default init;