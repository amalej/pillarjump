import {
  Scene,
  AxesHelper,
  PerspectiveCamera,
  GridHelper,
  DirectionalLight,
  DirectionalLightHelper,
  CameraHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class ThreeJSHelpers {
  static addAxesHelper(scene: Scene, size: number) {
    const axesHelper = new AxesHelper(size);
    scene.add(axesHelper);
  }

  static addOrbitHelper(
    camera: PerspectiveCamera,
    domElement: HTMLCanvasElement
  ) {
    const orbit = new OrbitControls(camera, domElement);
    orbit.update();
  }

  static addGridHelper(scene: Scene, size: number, divisions: number) {
    const gridHelper = new GridHelper(size, divisions);
    scene.add(gridHelper);
  }

  static addDirectionalLightHelper(
    scene: Scene,
    directionalLight: DirectionalLight
  ) {
    const dLightHelper = new DirectionalLightHelper(directionalLight, 5);
    scene.add(dLightHelper);
  }

  static addDirectionalLightShadowHelper(
    scene: Scene,
    directionalLight: DirectionalLight
  ) {
    const dLightShadowHelper = new CameraHelper(directionalLight.shadow.camera);
    scene.add(dLightShadowHelper);
  }
}
