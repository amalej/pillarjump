import {
  CylinderGeometry,
  Mesh,
  MeshStandardMaterial,
  type ColorRepresentation,
  type Scene,
} from "three";
import type Player from "./player";

interface PillarPlatformInterface {
  scene: Scene;
  position: { x: number; z: number };
  radius: number;
  height: number;
  player: Player;
  gameSpeed: number;
}

export default class PillarPlatform {
  PILLAR_SHRINK_SPEED = 0.006;
  PILLAR_SINK_SPEED = 0.25;
  PILLAR_RISE_SPEED = 0.25;
  scene: Scene;
  position: { x: number; z: number };
  radius: number;
  currentRadius: number;
  height: number;
  player: Player;
  isShrinking: boolean;
  isSinking: boolean;
  isDestroyed: boolean;
  isRising: boolean;
  hasGivenPlayerScore: boolean;
  mesh: Mesh;
  gameSpeed: number;

  constructor({
    scene,
    position: { x, z },
    radius,
    height,
    player,
    gameSpeed,
  }: PillarPlatformInterface) {
    this.scene = scene;
    this.position = { x, z };
    this.radius = radius;
    this.currentRadius = radius;
    this.height = height;
    this.player = player;
    this.isShrinking = false;
    this.isSinking = false;
    this.isDestroyed = false;
    this.isRising = true;
    this.hasGivenPlayerScore = false;
    this.gameSpeed = gameSpeed;

    const geometry = new CylinderGeometry(
      this.radius,
      this.radius * 0.9,
      this.height,
      50,
      10
    );
    const materials = [
      new MeshStandardMaterial({ color: 0xcecece }),
      new MeshStandardMaterial({ color: 0xeeeeee }),
    ];
    this.mesh = new Mesh(geometry, materials);
    this.mesh.position.y = 0;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.position.x = this.position.x;
    this.mesh.position.z = this.position.z;
  }

  isPlayerOnTop() {
    const xDist = this.mesh.position.x - this.player.mesh.position.x;
    const zDist = this.mesh.position.z - this.player.mesh.position.z;
    const dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(zDist, 2));
    if (dist < this.currentRadius) {
      return true;
    }
    return false;
  }

  update(deltaTime: number) {
    if (this.isDestroyed) {
      return;
    }
    if (this.isRising) {
      if (this.mesh.position.y < this.height / 2) {
        this.mesh.position.y +=
          this.PILLAR_RISE_SPEED * this.gameSpeed * deltaTime;
      }

      if (this.mesh.position.y >= this.height / 2) {
        this.mesh.position.y = this.height / 2;
        this.isRising = false;
      }
    } else if (this.isShrinking) {
      this.currentRadius -=
        this.PILLAR_SHRINK_SPEED * this.gameSpeed * deltaTime;
      this.mesh.scale.x = this.currentRadius / this.radius;
      this.mesh.scale.z = this.currentRadius / this.radius;

      if (this.currentRadius <= 0) {
        this.currentRadius = 0;
        this.isDestroyed = true;
        this.remove();
      }
    } else if (this.isSinking) {
      this.mesh.position.y -=
        this.PILLAR_SINK_SPEED * this.gameSpeed * deltaTime;

      if (this.mesh.position.y + this.height <= 0) {
        this.isDestroyed = true;
        this.remove();
      }
    }
  }

  _increasePlayerScore() {
    if (this.hasGivenPlayerScore === false) {
      this.player.increaseScore();
      this.hasGivenPlayerScore = true;
    }
  }

  shrink() {
    this.isShrinking = true;
    this._increasePlayerScore();
  }

  sink() {
    this.isShrinking = false;
    this.isSinking = true;
    this._increasePlayerScore();
  }

  remove() {
    this.scene.remove(this.mesh);
  }

  render() {
    this.scene.add(this.mesh);
  }
}
