import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * @param {any} model 模型
 * @param {any} modelGroup 模型组
 * @param {number} x 坐标x
 * @param {number} y 坐标y
 * @param {number} z 坐标z
 * @param {number} num 旋转角度 PI/num
 */
export const cloneModel = (model: any, modelGroup: any, x: number, y: number, z: number, num: number) => {
    let cloneObj = model.clone();
    cloneObj.children.map((v: any, i: any) => {
        if (v.material) {
            v.material = model.children[i].material.clone();
        }
    });
    cloneObj.position.set(x, y, z);
    //传入0时不旋转
    if (num != 0) {
        cloneObj.rotateY(Math.PI / num);
    }
    modelGroup.add(cloneObj);
};
