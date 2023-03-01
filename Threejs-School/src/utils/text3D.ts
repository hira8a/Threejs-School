import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Mesh, MeshPhongMaterial } from 'three';

function text3D(text: string, font: any, group: any) {
    const bevelEnabled: boolean = true
    const height: number = 20
    const size: number = 70
    const hover: number = 30
    const curveSegments: number = 4
    const bevelThickness: number = 2
    const bevelSize: number = 1.5


    const textGeo = new TextGeometry(text, {
        font: font,

        size: size,
        height: height,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled
    })
    const materials = [
        new MeshPhongMaterial({ color: 0x87CEFA, flatShading: true }), // front
        new MeshPhongMaterial({ color: 0x87CEFA }) // side
    ];

    textGeo.computeBoundingBox();
    const centerOffset = - 0.5 * (textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x);
    const textMesh1 = new Mesh(textGeo, materials);

    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    group.add( textMesh1 );

}

export { text3D }