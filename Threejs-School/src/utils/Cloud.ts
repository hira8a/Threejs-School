import {
    TextureLoader,
    PlaneGeometry,
    MeshLambertMaterial,
    Mesh
} from "three";

const smokeUrl = new URL('@/assets/images/rain/smoke.png', import.meta.url).href;
const texture = new TextureLoader().load(smokeUrl)
const cloudGeo = new PlaneGeometry(564, 300)
const cloudMaterial = new MeshLambertMaterial({
    map: texture,
    transparent: true
})
export default class Cloud {
    instance: any;

    constructor() {
        const cloud = new Mesh(cloudGeo, cloudMaterial)
        cloud.material.opacity = 0.6
        this.instance = cloud
    }

    setPosition(x:number, y:number, z:number) {
        this.instance.position.set(x, y, z)
    }

    setRotation(x:number, y:number, z:number) {
        this.instance.rotation.x = x
        this.instance.rotation.y = y
        this.instance.rotation.z = z
    }

    animate() {
        this.instance.rotation.z -= 0.003
    }
}