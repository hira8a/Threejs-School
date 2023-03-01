import * as THREE from 'three';

export const init = (canvas: HTMLCanvasElement) => {
    const renderer = new THREE.WebGLRenderer({
        //开启抗锯齿
        antialias: true,
        canvas
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 0);

    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);

    // 创建雨滴粒子
    var rainGeometry = new THREE.BufferGeometry();
    var rainVertices = [];

    for (var i = 0; i < 5000; i++) {
        var x = THREE.MathUtils.randFloatSpread(200);
        var y = THREE.MathUtils.randFloatSpread(200);
        var z = THREE.MathUtils.randFloatSpread(200);
        rainVertices.push(x, y, z);
    }
    rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));
    var rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.5,
        transparent: true
    });
    var rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);

        // 让雨滴随机下落
        var positions = rainGeometry.attributes.position;
        for (var i = 0; i < positions.count; i++) {
            var x = positions.getX(i);
            var y = positions.getY(i);
            var z = positions.getZ(i);
            y -= THREE.MathUtils.randFloat(0.1, 0.5);
            if (y < -100) {
                y = 200;
            }
            positions.setXYZ(i, x, y, z);
        }
        positions.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();


}
