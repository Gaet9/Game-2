import Phaser from "phaser";
import { Enemy } from "./Enemy";

export class JumperEnemy extends Enemy {
  private nextJumpAtMs = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, platforms?: Phaser.Physics.Arcade.StaticGroup) {
    super(scene, x, y, platforms);
    this.setTexture("enemy_jumper");
    this.hp = 4;
  }

  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (!this.alive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.down && time >= this.nextJumpAtMs) {
      body.setVelocityY(-520);
      this.nextJumpAtMs = time + 900 + Math.random() * 650;
    }
  }
}

