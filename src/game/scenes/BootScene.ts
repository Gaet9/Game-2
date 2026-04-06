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

    // Player: tall character with head/hat/clothes/limbs (18x48).
    g.clear();
    const bg = 0x0b1020;
    const skin = 0xffd6b0;
    const hat = 0x6c5ce7;
    const shirt = 0x66e3ff;
    const pants = 0x22336a;
    const shoe = 0x2d2a36;
    const outline = 0x0b1020;

    // Hat (brim + top)
    g.fillStyle(hat, 1);
    g.fillRoundedRect(4, 0, 10, 6, 2);
    g.fillRect(3, 5, 12, 2);

    // Head
    g.fillStyle(skin, 1);
    g.fillRoundedRect(5, 7, 8, 9, 3);

    // Face (eye)
    g.fillStyle(outline, 1);
    g.fillRect(9, 11, 2, 2);

    // Neck
    g.fillStyle(skin, 1);
    g.fillRoundedRect(8, 16, 2, 2, 1);

    // Torso / clothes (shirt)
    g.fillStyle(shirt, 1);
    g.fillRoundedRect(4, 18, 10, 10, 2);

    // Arms
    g.fillStyle(skin, 1);
    g.fillRoundedRect(2, 19, 3, 12, 1);
    g.fillRoundedRect(13, 19, 3, 12, 1);
    g.fillStyle(outline, 1);
    g.fillRect(3, 30, 1, 1);
    g.fillRect(14, 30, 1, 1);

    // Waist / belt line
    g.fillStyle(outline, 0.35);
    g.fillRect(4, 27, 10, 1);

    // Pants / legs (longer)
    g.fillStyle(pants, 1);
    g.fillRoundedRect(5, 28, 4, 12, 1);
    g.fillRoundedRect(9, 28, 4, 12, 1);

    // Shoes
    g.fillStyle(shoe, 1);
    g.fillRoundedRect(4, 40, 6, 6, 2);
    g.fillRoundedRect(8, 40, 6, 6, 2);
    g.fillStyle(outline, 0.25);
    g.fillRect(4, 44, 10, 1);

    // Tiny outline accents for readability on dark backgrounds
    g.fillStyle(bg, 0.9);
    g.fillRect(4, 18, 1, 10);
    g.fillRect(13, 18, 1, 10);
    g.generateTexture("player", 18, 48);

    // Enemy: little monster.
    g.clear();
    const monsterBody = 0xff5a6a;
    const monsterBelly = 0xff8f9a;
    const horn = 0xf2c14e;

    // Body
    g.fillStyle(monsterBody, 1);
    g.fillRoundedRect(0, 2, 20, 14, 6);
    // Belly
    g.fillStyle(monsterBelly, 1);
    g.fillRoundedRect(5, 7, 10, 7, 4);
    // Horns
    g.fillStyle(horn, 1);
    g.fillTriangle(3, 3, 6, 0, 7, 4);
    g.fillTriangle(17, 3, 14, 0, 13, 4);
    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillRect(6, 6, 3, 3);
    g.fillRect(11, 6, 3, 3);
    g.fillStyle(outline, 1);
    g.fillRect(7, 7, 1, 1);
    g.fillRect(12, 7, 1, 1);
    // Mouth + teeth
    g.fillRect(8, 11, 4, 1);
    g.fillStyle(0xffffff, 1);
    g.fillRect(8, 12, 1, 1);
    g.fillRect(11, 12, 1, 1);
    g.generateTexture("enemy", 20, 16);

    // Jumper enemy: green monster with legs.
    g.clear();
    g.fillStyle(0x44d27c, 1);
    g.fillRoundedRect(0, 2, 20, 14, 6);
    g.fillStyle(0x0b1020, 1);
    g.fillRect(6, 6, 3, 3);
    g.fillRect(11, 6, 3, 3);
    g.fillStyle(0x2d2a36, 1);
    g.fillRoundedRect(4, 14, 5, 3, 1);
    g.fillRoundedRect(11, 14, 5, 3, 1);
    g.generateTexture("enemy_jumper", 20, 16);

    // Shooter enemy: blue monster with a visor.
    g.clear();
    g.fillStyle(0x66e3ff, 1);
    g.fillRoundedRect(0, 2, 20, 14, 6);
    g.fillStyle(0x0b1020, 0.45);
    g.fillRoundedRect(3, 6, 14, 5, 3);
    g.fillStyle(0xffffff, 1);
    g.fillRect(6, 7, 3, 3);
    g.fillRect(11, 7, 3, 3);
    g.generateTexture("enemy_shooter", 20, 16);

    // Platform tile.
    g.clear();
    g.fillStyle(0x18244d, 1);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(0x22336a, 1);
    g.fillRect(0, 0, 32, 6);
    g.generateTexture("platform", 32, 32);

    // Breakable crate.
    g.clear();
    g.fillStyle(0x8d5a2b, 1);
    g.fillRoundedRect(0, 0, 32, 32, 4);
    g.fillStyle(0x6b3f1b, 1);
    g.fillRect(2, 2, 28, 4);
    g.fillRect(2, 26, 28, 4);
    g.fillRect(2, 2, 4, 28);
    g.fillRect(26, 2, 4, 28);
    g.fillStyle(0x2d2a36, 0.35);
    g.fillRect(6, 6, 20, 2);
    g.fillRect(6, 24, 20, 2);
    g.generateTexture("crate", 32, 32);

    // Lava tile (instant-death hazard).
    g.clear();
    g.fillStyle(0x2d0200, 1);
    g.fillRect(0, 0, 32, 32);
    g.fillStyle(0xff3b1f, 1);
    g.fillRoundedRect(2, 12, 28, 18, 8);
    g.fillStyle(0xffb000, 1);
    g.fillRoundedRect(6, 16, 20, 12, 6);
    g.fillStyle(0x7a1200, 0.65);
    g.fillRect(0, 0, 32, 3);
    g.generateTexture("lava", 32, 32);

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

    // Glove projectile (slower/heavier).
    g.clear();
    g.fillStyle(0xff8f9a, 1);
    g.fillRoundedRect(0, 0, 12, 10, 4);
    g.fillStyle(0x0b1020, 0.35);
    g.fillRect(2, 7, 8, 1);
    g.generateTexture("glove_projectile", 12, 10);

    // Enemy projectile.
    g.clear();
    g.fillStyle(0x9aa6c8, 1);
    g.fillRoundedRect(0, 0, 10, 6, 3);
    g.fillStyle(0x0b1020, 0.4);
    g.fillRect(2, 2, 6, 2);
    g.generateTexture("enemy_projectile", 10, 6);

    // Weapon pickups.
    g.clear();
    g.fillStyle(0xf2c14e, 1);
    g.fillRoundedRect(0, 0, 18, 18, 4);
    g.fillStyle(0x0b1020, 1);
    g.fillRect(5, 8, 8, 2);
    g.generateTexture("pickup_blaster", 18, 18);

    g.clear();
    g.fillStyle(0x6c5ce7, 1);
    g.fillRoundedRect(0, 0, 18, 18, 4);
    g.fillStyle(0xffffff, 1);
    g.fillRect(4, 8, 10, 2);
    g.fillRect(8, 4, 2, 10);
    g.generateTexture("pickup_sword", 18, 18);

    g.clear();
    g.fillStyle(0xff8f9a, 1);
    g.fillRoundedRect(0, 0, 18, 18, 4);
    g.fillStyle(0x0b1020, 1);
    g.fillRoundedRect(5, 6, 8, 9, 3);
    g.generateTexture("pickup_glove", 18, 18);

    g.destroy(true);
  }
}

