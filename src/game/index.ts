import {
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera,
  Fog,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";
import Player from "./player";
import PillarPlatform from "./pillarPlatform";
import Lights from "./lights";

const RENDERER_WITDH = window.innerWidth;
const RENDERER_HEIGHT = window.innerHeight;
const CAMERA_FOV = 80;
const CAMERA_ASPECT_RATIO = window.innerWidth / window.innerHeight;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;
const PLAYER_RADIUS = 1;
const PLAYER_HEIGHT = 0.75;
const PILLAR_HEIGHT = 30;
const FOG_COLOR = 0xaa7777;
const MINIMUM_PILLAR_COUNT = 7;
const BASE_GAME_SPEED = 1.25;
const MAX_GAME_SPEED = 2.25;

const GAME_DELTA_TIME_LIST_COUNT = 10;

export default class Game {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  player: Player;
  private pillars: PillarPlatform[];
  private passedPillars: PillarPlatform[];
  private lastPillarPlayerWasOn: PillarPlatform | null = null;
  gameSpeed: number = 1;
  private lastGameLoopTimestamp: number | null = null;
  playerHasMoved: boolean = false;
  private playerNotOnPlatformCheckBufferMax: number = 3;
  private playerNotOnPlatformCheckBufferCounter: number = 0;
  onScoreChange?: (score: number) => any;
  onGameOver?: (score: number) => any;
  private isGameRunning = false;
  private deltaTimeArray: number[] = [];
  constructor() {
    this.renderer = new WebGLRenderer({
      antialias: true,
    });
    const game = this;
    this.renderer.setSize(RENDERER_WITDH, RENDERER_HEIGHT);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new Scene();
    this.scene.fog = new Fog(FOG_COLOR, 20, 35);
    this.scene.background = new Color(0xaa7777);

    this.camera = new PerspectiveCamera(
      CAMERA_FOV,
      CAMERA_ASPECT_RATIO,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    this.camera.position.set(0, 15 + PILLAR_HEIGHT, 5.5);
    this.camera.rotateX(-Math.PI * 0.35);

    this.player = new Player({
      scene: this.scene,
      position: {
        x: 0,
        z: 0,
        y: PILLAR_HEIGHT,
      },
      height: PLAYER_HEIGHT,
      radius: PLAYER_RADIUS,
      onScoreChage: (score) => {
        if (game.onScoreChange !== undefined) game.onScoreChange(score);
      },
      gameSpeed: 1,
    });

    this.player.addToScene();
    this.addBasePlane();
    this.addLights();

    this.pillars = [];
    this.passedPillars = [];

    this.renderer.setAnimationLoop((timestamp: number) => {
      const deltaTime = timestamp - (game.lastGameLoopTimestamp ?? timestamp);
      if (game.deltaTimeArray.length < GAME_DELTA_TIME_LIST_COUNT) {
        game.deltaTimeArray.push(deltaTime);
      } else {
        game.deltaTimeArray.shift();
        game.deltaTimeArray.push(deltaTime);
      }

      game.lastGameLoopTimestamp = timestamp;
      game.gameLoop(deltaTime);
      game.renderer.render(game.scene, game.camera);
    });
    this.addControls();
  }

  private addControls() {
    const game = this;
    window.onkeydown = function (event) {
      if (event.key === " ") {
        if (game.isGameRunning) {
          game.lastPillarPlayerWasOn = null;
          game.playerHasMoved = true;
          game.player.switchCircle();
        }
      }
    };

    this.renderer.domElement.addEventListener(
      "touchstart",
      function (event) {
        if (game.isGameRunning) {
          game.lastPillarPlayerWasOn = null;
          game.playerHasMoved = true;
          game.player.switchCircle();
        }
      },
      { passive: true }
    );
  }

  private addBasePlane() {
    const planeGeometry = new PlaneGeometry(75, 75);
    const planeMaterial = new MeshStandardMaterial({
      color: FOG_COLOR,
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.position.z = -5;
    this.scene.add(plane);
  }

  private addLights() {
    Lights.addAmbientLight(this.scene, 0xffffff, 0.7);
    Lights.addDirectionalLight(this.scene, 0xffffff, 0.7, PILLAR_HEIGHT);
  }

  private generatePillar() {
    const player = this.player;
    const pillars = this.pillars;
    const startAngle = (Math.PI * 25) / 180;
    const endAngle = (Math.PI * 155) / 180;
    const angle = Math.random() * (endAngle - startAngle) + startAngle;

    const minRadius = PLAYER_RADIUS * 1.5;
    const maxRadius = PLAYER_RADIUS * 2.0;
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;

    let pillar;
    if (pillars.length === 0) {
      pillar = new PillarPlatform({
        scene: this.scene,
        position: {
          x: player.mesh.position.x + Math.cos(angle) * player.circleDistance,
          z: -(
            player.mesh.position.z +
            Math.sin(angle) * player.circleDistance
          ),
        },
        height: PILLAR_HEIGHT,
        radius: radius,
        player: player,
        gameSpeed: 1,
      });
    } else {
      pillar = new PillarPlatform({
        scene: this.scene,
        position: {
          x:
            pillars[pillars.length - 1].mesh.position.x +
            Math.cos(angle) * player.circleDistance,
          z:
            this.pillars[pillars.length - 1].mesh.position.z -
            Math.sin(angle) * player.circleDistance,
        },
        height: PILLAR_HEIGHT,
        radius: radius,
        player: player,
        gameSpeed: 1,
      });
    }
    pillar.render();
    this.pillars.push(pillar);
  }

  private handlePanShift(deltaTime: number) {
    const smoothConstant = 0.05;
    const smoothXPanShiftMultiplier =
      Math.abs(this.player.mesh.position.x - this.player.originalPosition.x) *
      smoothConstant *
      this.gameSpeed *
      deltaTime;
    const smoothZPanShiftMultiplier =
      Math.abs(this.player.mesh.position.z - this.player.originalPosition.z) *
      smoothConstant *
      this.gameSpeed *
      deltaTime;

    const baseShiftSpeed = 0.75;
    let xShift = 0;
    let zShift = 0;
    if (
      this.player.mesh.position.x - this.player.originalPosition.x >
      baseShiftSpeed
    ) {
      xShift += -baseShiftSpeed * smoothXPanShiftMultiplier;
    } else if (
      this.player.mesh.position.x - this.player.originalPosition.x <
      -baseShiftSpeed
    ) {
      xShift += baseShiftSpeed * smoothXPanShiftMultiplier;
    }

    if (
      this.player.mesh.position.z - this.player.originalPosition.z >
      baseShiftSpeed
    ) {
      zShift += -baseShiftSpeed * smoothZPanShiftMultiplier;
    } else if (
      this.player.mesh.position.z - this.player.originalPosition.z <
      -baseShiftSpeed
    ) {
      zShift += baseShiftSpeed * smoothZPanShiftMultiplier;
    }

    for (let pillar of this.pillars) {
      pillar.mesh.position.x += xShift;
      pillar.mesh.position.z += zShift;
    }

    for (let pillar of this.passedPillars) {
      pillar.mesh.position.x += xShift;
      pillar.mesh.position.z += zShift;
    }

    this.player.mesh.position.x += xShift;
    this.player.mesh.position.z += zShift;
  }

  private gameLoop(deltaTime: number) {
    if (!this.isGameRunning) return;
    this.handleGameSpeed();
    let isPlayerOnPlatform = false;
    const normalizedDeltaTime = deltaTime / 16;

    while (this.pillars.length < MINIMUM_PILLAR_COUNT) {
      this.generatePillar();
    }

    const _pillars = [...this.pillars];
    this.pillars = [..._pillars].filter(
      (pillar) => pillar.isDestroyed == false
    );
    this.passedPillars = [...this.passedPillars, ..._pillars].filter(
      (pillar) => pillar.isSinking && pillar.isDestroyed === false
    );

    for (let i = 0; i < this.pillars.length; i++) {
      const pillar = this.pillars[i];

      // Try to optimize by not rendering the shadow of far away pillars
      if (i > 3) {
        pillar.mesh.receiveShadow = false;
        pillar.mesh.castShadow = false;
      } else {
        pillar.mesh.receiveShadow = true;
        pillar.mesh.castShadow = true;
      }

      if (pillar.isPlayerOnTop()) {
        isPlayerOnPlatform = true;
        this.lastPillarPlayerWasOn = pillar;
        pillar.shrink();
      }
      else if (
        this.player.mesh.position.z <
        pillar.mesh.position.z - pillar.currentRadius
      ) {
        pillar.sink();
        this.passedPillars.push(pillar);
        this.pillars.shift();
      }
      pillar.update(normalizedDeltaTime);
    }

    for (let pillar of this.passedPillars) {
      pillar.update(normalizedDeltaTime);
    }

    if (!isPlayerOnPlatform) {
      this.playerNotOnPlatformCheckBufferCounter += 1;
    } else {
      this.playerNotOnPlatformCheckBufferCounter = 0;
    }

    if (
      this.playerNotOnPlatformCheckBufferCounter >=
        this.playerNotOnPlatformCheckBufferMax &&
      this.playerHasMoved
    ) {
      this.player.fall(this.lastPillarPlayerWasOn);
      this.handleGameOver();
    }

    this.player.update(normalizedDeltaTime);
    this.handlePanShift(normalizedDeltaTime);
  }

  start() {
    for (let pillar of this.pillars) {
      pillar.remove();
    }
    for (let pillar of this.passedPillars) {
      pillar.remove();
    }
    this.isGameRunning = true;
    this.pillars = [];
    this.passedPillars = [];
    this.playerHasMoved = false;
    this.playerNotOnPlatformCheckBufferCounter = 0;
    this.player.reset();
  }

  private handleGameOver() {
    this.isGameRunning = false;
    if (this.onGameOver !== undefined) this.onGameOver(this.player.score);
  }

  private handleGameSpeed() {
    if (this.gameSpeed < MAX_GAME_SPEED) {
      this.gameSpeed = BASE_GAME_SPEED + this.player.score / 200;
    } else {
      this.gameSpeed = MAX_GAME_SPEED;
    }

    this.player.gameSpeed = this.gameSpeed;
    for (let pillar of this.pillars) {
      pillar.gameSpeed = this.gameSpeed;
    }
    for (let pillar of this.passedPillars) {
      pillar.gameSpeed = this.gameSpeed;
    }
  }

  getAverageDeltaTime() {
    let sum = 0;
    for (let deltaTime of this.deltaTimeArray) {
      sum += deltaTime;
    }
    return sum / this.deltaTimeArray.length;
  }

  pause() {
    this.isGameRunning = false;
  }

  resume() {
    this.isGameRunning = true;
  }
}
