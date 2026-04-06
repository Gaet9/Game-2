import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, dir: -1 | 1, textureKey: string = "projectile", speed = 620) {
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.setVelocityX(dir * speed);
    body.setSize(this.width, this.height, true);

    this.setFlipX(dir === -1);
  }
}

