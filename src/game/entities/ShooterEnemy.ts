import Phaser from "phaser";
import { Enemy } from "./Enemy";

export class ShooterEnemy extends Enemy {
  private nextShotAtMs = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, platforms?: Phaser.Physics.Arcade.StaticGroup) {
    super(scene, x, y, platforms);
    this.setTexture("enemy_shooter");
    this.hp = 5;
  }

  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (!this.alive) return;
    if (time < this.nextShotAtMs) return;

    const player = (this.scene as Phaser.Scene & { player?: Phaser.GameObjects.Sprite }).player as
      | Phaser.GameObjects.Sprite
      | undefined;
    if (!player) {
      this.nextShotAtMs = time + 800;
      return;
    }

    const dx = player.x - this.x;
    if (Math.abs(dx) > 520) {
      this.nextShotAtMs = time + 500;
      return;
    }

    this.nextShotAtMs = time + 900 + Math.random() * 500;
    this.emit("shoot", { x: this.x, y: this.y - 6, dir: dx < 0 ? -1 : 1 });
  }
}

