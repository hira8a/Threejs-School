import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cloneModel } from '@/utils/model';

const Load = (modelGroup: any) => {
    // 实例化gltf载入库
    const bulidLoader1 = new GLTFLoader();
    const bulid1Url = new URL('@/assets/model/house9.glb', import.meta.url).href;
    bulidLoader1.load(bulid1Url, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.8, 0.6, 1);
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
        cloneModel(model, modelGroup, 30, 0, 17.5, 0);
    });

    const bulidLoader1_1 = new GLTFLoader();
    bulidLoader1_1.load(bulid1Url, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.55, 0.6, 1);
        model.position.set(6, 0, -24);
        model.rotateY(Math.PI / 1);
        //遍历子节点，开启每个子节点的阴影模式。
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
    });

    const bulidLoader1_2 = new GLTFLoader();
    bulidLoader1_2.load(bulid1Url, (gltf) => {
        let model = gltf.scene;
        model.scale.set(1.2, 0.6, 1);
        model.position.set(-23, 0, 26);
        model.rotateY(Math.PI / -2);
        //遍历子节点，开启每个子节点的阴影模式。
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
        cloneModel(model, modelGroup, -5, 0, 26, 1);
    });

    const bulidLoader2 = new GLTFLoader();
    const bulid2Url = new URL('@/assets/model/building02.glb', import.meta.url).href;
    bulidLoader2.load(bulid2Url, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.0007, 0.0007, 0.0005);
        model.position.set(-32, 0, -37);
        model.rotateY(Math.PI / -2);
        //遍历子节点，开启每个子节点的阴影模式。
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
    });

    //直路
    const roadLoader1 = new GLTFLoader();
    const road1Url = new URL('@/assets/model/road.glb', import.meta.url).href;
    roadLoader1.load(road1Url, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.2, 0.05, 0.05);
        model.position.set(-60, 0.07, 60);
        //model.rotateY(Math.PI / -2);
        model.traverse((child) => {
            if (child.isMesh) {
                //child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
        cloneModel(model, modelGroup, -34.6, 0.07, 76, 2);
        cloneModel(model, modelGroup, -34.6, 0.07, 40, 2);
        cloneModel(model, modelGroup, -60, 0.07, -33.8, 0);
        cloneModel(model, modelGroup, -24, 0.07, -33.8, 0);
        cloneModel(model, modelGroup, 49.44, 0.07, 30, 2);
        cloneModel(model, modelGroup, 49.44, 0.07, 59, 2);
        //cloneModel(model, scene, -20, 0.07, 45, 0);
    });
    const roadLoader1_1 = new GLTFLoader();
    roadLoader1_1.load(road1Url, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.05, 0.05, 0.05);
        model.position.set(13.9, 0.07, 58);
        model.rotateY(Math.PI / 2);
        model.traverse((child) => {
            if (child.isMesh) {
                //child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
        cloneModel(model, modelGroup, -34.6, 0.07, -18, 0);
        cloneModel(model, modelGroup, 30, 0.07, 32.9, 2);
        cloneModel(model, modelGroup, 39, 0.07, 32.9, 2);
        cloneModel(model, modelGroup, 47, 0.07, 32.9, 2);
    });
    //90度弯道
    const roadLoader2 = new GLTFLoader();
    const road2Url = new URL('@/assets/model/road_bend.glb', import.meta.url).href;
    roadLoader2.load(road2Url, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.05, 0.05, 0.05);
        model.position.set(3, 0.07, 44.6);
        model.rotateY(Math.PI / 2);
        model.traverse((child) => {
            if (child.isMesh) {
                //child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
        cloneModel(model, modelGroup, -29, 0.07, 49.1, -2);
        cloneModel(model, modelGroup, 34, 0.07, -32.75, 2);
        cloneModel(model, modelGroup, 38.6, 0.07, 27.3, 0);
    });
    //三岔口
    const roadLoader3 = new GLTFLoader();
    const road3Url = new URL('@/assets/model/road_three.glb', import.meta.url).href;
    roadLoader3.load(road3Url, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.05, 0.05, 0.05);
        model.position.set(19.27, -0.88, 40);
        model.rotateY(Math.PI / 2);
        model.traverse((child) => {
            if (child.isMesh) {
                //child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
        cloneModel(model, modelGroup, -29.25, -0.88, -36.5, 0);
    });
    // //十字路口
    // const roadLoader4 = new GLTFLoader();
    // const road4Url = new URL('@/assets/model/road_four.glb', import.meta.url).href;
    // roadLoader4.load(road4Url, (gltf) => {
    //     let model = gltf.scene;
    //     model.scale.set(0.05, 0.05, 0.05);
    //     model.position.set(27, 0.07, 30);
    //     model.traverse((child) => {
    //         if (child.isMesh) {
    //             //child.castShadow = true;
    //             child.receiveShadow = true;
    //         }
    //     });
    //     scene.add(model);
    //     //cloneModel(model, 29, 0.07, 30, 0);
    // });

    // //树
    const treeLoader = new GLTFLoader();
    const treeUrl = new URL('@/assets/model/low_poly_tree.glb', import.meta.url).href;
    treeLoader.load(treeUrl, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.005, 0.005, 0.005);
        model.position.set(19, 0, 32);
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                //child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
        cloneModel(model, modelGroup, 25, 0, 32, 0);
        let treeN = 6;
        for (let i = 0; i < 5; i++) {
            cloneModel(model, modelGroup, 25, 0, 32 - treeN, 0);
            cloneModel(model, modelGroup, 19, 0, 32 - treeN, 0);
            cloneModel(model, modelGroup, 21 - treeN, 0, -18, 0);
            treeN += 6;
        }
        cloneModel(model, modelGroup, 3, 0, -4, 0);
        cloneModel(model, modelGroup, -3, 0, -4, 0);
        cloneModel(model, modelGroup, -25, 0, -4, 0);
        cloneModel(model, modelGroup, -31, 0, -4, 0);

        cloneModel(model, modelGroup, -13, 0, 15, 0);
        cloneModel(model, modelGroup, -13, 0, 25, 0);
        cloneModel(model, modelGroup, -13, 0, 35, 0);
    });

    //草地
    const grassLoader = new GLTFLoader();
    const grassUrl = new URL('@/assets/model/flat_grass_surface.glb', import.meta.url).href;
    grassLoader.load(grassUrl, (gltf) => {
        let model = gltf.scene;
        model.scale.set(0.002, 0.003, 0.0035);
        model.position.set(23, 0.2, 17);
        model.traverse((child) => {
            if (child.isMesh) {
                //child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
    });

    //网球场
    const tennis_courtLoader = new GLTFLoader();
    const tennis_courtUrl = new URL('@/assets/model/tennis_court.glb', import.meta.url).href;
    tennis_courtLoader.load(tennis_courtUrl, (gltf) => {
        let model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(20, 0.2, 44.5);
        model.rotateY(Math.PI / 2);
        model.traverse((child) => {
            if (child.isMesh) {
                //child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scene.add(model);
        modelGroup.add(model);
        cloneModel(model, modelGroup, 20, 0.19, 50.5, -1);
    });

    //scene.add(modelGroup);
};

export default Load;