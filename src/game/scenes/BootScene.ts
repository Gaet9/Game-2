import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  public static readonly KEY = "BootScene";

  constructor() {
    super(BootScene.KEY);
  }

  preload() {
    // Placeholder: when you add real art/audio, load it here.
  }

  create() {
    this.createPlaceholderTextures();
    this.scene.start("LevelScene");
  }

  private createPlaceholderTextures() {
    const g = this.add.graphics();

    // Player: little man (simple blocky silhouette).
    g.clear();
    g.fillStyle(0x66e3ff, 1);
    g.fillRoundedRect(0, 0, 18, 24, 4);
    g.fillStyle(0x0b1020, 1);
    g.fillRect(5, 6, 3, 3); // eye
    g.generateTexture("player", 18, 24);

    // Enemy: red blob.
    g.clear();
    g.fillStyle(0xff5a6a, 1);
    g.fillRoundedRect(0, 0, 20, 16, 6);
    g.fillStyle(0x0b1020, 1);
    g.fillRect(6, 5, 3, 3);
    g.fillRect(12, 5, 3, 3);
    g.generateTexture("enemy", 20, 16);

    // Platform tile.
    g.clear();
    g.fillStyle(0x18244d, 1);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(0x22336a, 1);
    g.fillRect(0, 0, 32, 6);
    g.generateTexture("platform", 32, 32);

    // Spikes (hazard).
    g.clear();
    g.fillStyle(0x9aa6c8, 1);
    g.fillTriangle(0, 24, 8, 6, 16, 24);
    g.fillTriangle(16, 24, 24, 6, 32, 24);
    g.fillStyle(0x5f6b90, 1);
    g.fillRect(0, 24, 32, 8);
    g.generateTexture("spikes", 32, 32);

    // Projectile (weapon shot).
    g.clear();
    g.fillStyle(0xf2c14e, 1);
    g.fillRoundedRect(0, 0, 10, 6, 3);
    g.generateTexture("projectile", 10, 6);

    // Weapon pickup.
    g.clear();
    g.fillStyle(0xf2c14e, 1);
    g.fillRoundedRect(0, 0, 18, 18, 4);
    g.fillStyle(0x0b1020, 1);
    g.fillRect(5, 8, 8, 2);
    g.generateTexture("pickup_blaster", 18, 18);

    g.destroy(true);
  }
}

