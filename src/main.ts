import Phaser from "phaser";
import { BootScene } from "./game/scenes/BootScene";
import { LevelScene } from "./game/scenes/LevelScene";

const WIDTH = 960;
const HEIGHT = 540;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#0b1020",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: false
    }
  },
  scene: [BootScene, LevelScene]
};

new Phaser.Game(config);

