import {
  AmbientLight,
  DirectionalLight,
  Scene,
  type ColorRepresentation,
} from "three";

export default class Lights {
  static addAmbientLight(
    scene: Scene,
    color: ColorRepresentation,
    intensity: number
  ) {
    const ambientLight = new AmbientLight(color, intensity);
    scene.add(ambientLight);
  }

  static addDirectionalLight(
    scene: Scene,
    color: ColorRepresentation,
    intensity: number,
    height: number
  ) {
    const directionalLight = new DirectionalLight(color, intensity);
    scene.add(directionalLight);
    directionalLight.position.y = height + 15;
    directionalLight.position.x = -15;
    directionalLight.position.z = -10;
    directionalLight.target.position.x = 20;
    directionalLight.target.position.z = -20;
    directionalLight.target.position.y = height * 0.5;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.left = -20;
    directionalLight.castShadow = true;
  }
}
