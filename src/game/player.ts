import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  type Scene,
} from "three";
import type PillarPlatform from "./pillarPlatform";

interface PlayerConstructor {
  scene: Scene;
  position: { x: number; z: number; y: number };
  radius: number;
  height: number;
  onScoreChage?: (score: number) => any;
  onGameOver?: () => any;
  gameSpeed: number;
}

export default class Player {
  ROTATION_SPEED = 0.04;
  FALL_SPEED = 0.3;
  gameSpeed: number;
  scene: Scene;
  radius: number;
  height: number;
  circleDistance: number;
  originalPosition: { x: number; y: number; z: number };
  score: number;
  onScoreChage?: () => any;
  mesh: Mesh;
  rotationAngle: number;
  rotationDirection: number;
  revolvingCircle: PlayerRevolvingCircle;
  isFalling: boolean;
  pillar: PillarPlatform | null = null;
  deathPivotGroup: Group;
  positionOnDeath: {
    x: number;
    y: number;
    z: number;
  } | null = null;

  constructor({
    scene,
    position: { x, z, y },
    radius,
    height,
    onScoreChage,
    gameSpeed,
  }: PlayerConstructor) {
    this.gameSpeed = gameSpeed;
    this.scene = scene;
    this.radius = radius;
    this.height = height;
    this.circleDistance = this.radius * 4;
    this.originalPosition = { x, y, z };
    this.score = 0;
    this.onScoreChage = () => {
      if (onScoreChage !== undefined) onScoreChage(this.score);
    };
    this.isFalling = false;

    const geometry = new CylinderGeometry(
      this.radius,
      this.radius,
      this.height
    );
    const materials = [
      new MeshStandardMaterial({ color: 0x1a78c2 }),
      new MeshStandardMaterial({ color: 0x2196ff }),
      new MeshStandardMaterial({ color: 0x1a78c2 }),
    ];
    this.mesh = new Mesh(geometry, materials);
    this.mesh.position.x = x;
    this.mesh.position.z = z;
    this.mesh.position.y = y + this.height / 2;

    this.rotationAngle = 0;
    this.rotationDirection = 1;

    this.revolvingCircle = new PlayerRevolvingCircle({
      scene: this.scene,
      position: {
        x:
          this.mesh.position.x +
          Math.cos(this.rotationAngle) * this.circleDistance,
        y: this.mesh.position.y + this.height / 2,
        z:
          this.mesh.position.z +
          Math.sin(this.rotationAngle) * this.circleDistance,
      },
      height: this.height,
      radius: this.radius,
    });
    this.mesh.castShadow = true;

    this.deathPivotGroup = new Group();
    this.deathPivotGroup.add(this.mesh);
  }

  increaseScore() {
    this.score += 1;
    if (this.onScoreChage !== undefined) this.onScoreChage();
  }

  reset() {
    this.score = 0;
    this.rotationAngle = 0;
    if (this.onScoreChage !== undefined) this.onScoreChage();
    this.isFalling = false;
    this.mesh.position.x = this.originalPosition.x;
    this.mesh.position.z = this.originalPosition.z;
    this.mesh.position.y = this.originalPosition.y + this.height / 2;
    this.pillar = null;
    this.mesh.rotation.z = 0;
    this.mesh.rotation.x = 0;
    this.positionOnDeath = null;
    this.deathPivotGroup.position.set(0, 0, 0);
    this.deathPivotGroup.rotation.set(0, 0, 0);
  }

  switchCircle() {
    const [x, z] = [this.mesh.position.x, this.mesh.position.z];
    this.mesh.position.x = this.revolvingCircle.mesh.position.x;
    this.mesh.position.z = this.revolvingCircle.mesh.position.z;
    this.revolvingCircle.mesh.position.x = x;
    this.revolvingCircle.mesh.position.z = z;

    const newAngle = this.rotationAngle + Math.PI;
    this.rotationAngle = newAngle;
    this.rotationDirection = Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  }

  update(deltaTime: number) {
    if (!this.isFalling) {
      this.rotationAngle +=
        this.ROTATION_SPEED *
        this.rotationDirection *
        this.gameSpeed *
        deltaTime;
      this.revolvingCircle.mesh.position.x =
        this.mesh.position.x +
        Math.cos(this.rotationAngle) * this.circleDistance;
      this.revolvingCircle.mesh.position.z =
        this.mesh.position.z +
        Math.sin(this.rotationAngle) * this.circleDistance;
    } else {
      // Player fall animation.
      if (this.pillar !== null) {
        // If player is on a pillar, tilt the player to make it look like they fell.
        if (this.pillar.currentRadius > 0) {
          // Calculation to tilt the player.
          if (!this.positionOnDeath) {
            // this.mesh.rotateOnAxis(axis, 1);
            this.positionOnDeath = {
              x: this.mesh.position.x,
              y: this.mesh.position.y,
              z: this.mesh.position.z,
            };

            this.mesh.position.set(0, this.height / 2, 0);
            this.deathPivotGroup.position.set(
              this.positionOnDeath.x,
              this.positionOnDeath.y - this.height / 2,
              this.positionOnDeath.z
            );
          }
          const maxRotationZ = -(Math.PI / 2);

          if (
            Math.abs(this.deathPivotGroup.rotation.z) >= Math.abs(maxRotationZ)
          ) {
            this.deathPivotGroup.rotation.z = maxRotationZ;
            this.deathPivotGroup.position.y -= this.FALL_SPEED;
          } else {
            this.deathPivotGroup.rotation.z += maxRotationZ * 0.05;
            const dZ = this.pillar.mesh.position.z - this.positionOnDeath.z;
            const dX = this.pillar.mesh.position.x - this.positionOnDeath.x;
            const fallRotationAngle = Math.atan2(dZ, -dX);

            this.deathPivotGroup.rotation.y = fallRotationAngle;
          }
        } else {
          // Just make the player fall if the pillar no longer has radius.
          if (this.mesh.position.y > 0) this.mesh.position.y -= this.FALL_SPEED;
        }
      } else {
        // Just make the player fall if there is no pillar.
        if (this.mesh.position.y > 0) this.mesh.position.y -= this.FALL_SPEED;
      }
    }
  }

  fall(pillar: PillarPlatform | null) {
    this.isFalling = true;
    this.pillar = pillar;
    if (pillar !== null) {
      pillar.isShrinking = false;
    }
  }

  addToScene() {
    this.scene.add(this.revolvingCircle.mesh);
    this.scene.add(this.deathPivotGroup);
    // this.scene.add(this.mesh);
  }
}

interface PlayerRevolvingCircleConstructor {
  scene: Scene;
  position: { x: number; z: number; y: number };
  radius: number;
  height: number;
}

class PlayerRevolvingCircle {
  radius: number;
  height: number;
  mesh: Mesh;
  scene: Scene;
  constructor({
    scene,
    position: { x, z, y },
    radius,
    height,
  }: PlayerRevolvingCircleConstructor) {
    this.scene = scene;
    this.radius = radius;
    this.height = height;
    const _geometry = new CylinderGeometry(
      this.radius,
      this.radius,
      this.height
    );
    const _materials = [
      new MeshStandardMaterial({ color: 0x1a78c2 }),
      new MeshStandardMaterial({ color: 0x2196ff }),
      new MeshStandardMaterial({ color: 0x1a78c2 }),
      // new MeshStandardMaterial({ color: 0x00ffff }),
      // new MeshStandardMaterial({ color: 0x00ffff }),
      // new MeshStandardMaterial({ color: 0x00ffff }),
    ];

    this.mesh = new Mesh(_geometry, _materials);
    this.mesh.position.x = x;
    this.mesh.position.y = y - this.height / 2;
    this.mesh.position.z = z;
    this.mesh.castShadow = true;
  }
}
