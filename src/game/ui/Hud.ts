import Phaser from "phaser";
import { Player } from "../entities/Player";

export class Hud {
  private readonly scene: Phaser.Scene;
  private readonly player: Player;

  private readonly container: Phaser.GameObjects.Container;
  private readonly pvBarBg: Phaser.GameObjects.Rectangle;
  private readonly pvBarFill: Phaser.GameObjects.Rectangle;
  private readonly pvText: Phaser.GameObjects.Text;
  private readonly weaponText: Phaser.GameObjects.Text;
  private readonly gameOverOverlay: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;

    const pad = 14;
    this.pvBarBg = scene.add.rectangle(pad, pad, 220, 18, 0x121a37).setOrigin(0, 0);
    this.pvBarBg.setStrokeStyle(1, 0x2a3b78, 1);

    this.pvBarFill = scene.add.rectangle(pad + 2, pad + 2, 216, 14, 0x44d27c).setOrigin(0, 0);

    this.pvText = scene.add.text(pad, pad + 22, "", {
      fontSize: "14px",
      color: "#e8eefc"
    });

    this.weaponText = scene.add.text(pad, pad + 42, "", {
      fontSize: "14px",
      color: "#e8eefc"
    });

    this.container = scene.add.container(0, 0, [this.pvBarBg, this.pvBarFill, this.pvText, this.weaponText]);
    this.container.setScrollFactor(0);
    this.container.setDepth(1000);

    const w = scene.scale.width;
    const h = scene.scale.height;
    const overlayBg = scene.add.rectangle(0, 0, w, h, 0x000000, 0.55).setOrigin(0, 0);
    overlayBg.setScrollFactor(0);

    const title = scene.add
      .text(w / 2, h / 2 - 24, "GAME OVER", { fontSize: "48px", color: "#e8eefc" })
      .setOrigin(0.5);
    title.setScrollFactor(0);

    const hint = scene.add
      .text(w / 2, h / 2 + 28, "Press R to restart", { fontSize: "18px", color: "#e8eefc" })
      .setOrigin(0.5);
    hint.setScrollFactor(0);

    this.gameOverOverlay = scene.add.container(0, 0, [overlayBg, title, hint]);
    this.gameOverOverlay.setDepth(2000);
    this.gameOverOverlay.setVisible(false);
    this.gameOverOverlay.setScrollFactor(0);
  }

  public update() {
    const ratio = Phaser.Math.Clamp(this.player.pv / this.player.pvMax, 0, 1);
    this.pvBarFill.width = 216 * ratio;

    if (ratio > 0.6) this.pvBarFill.fillColor = 0x44d27c;
    else if (ratio > 0.25) this.pvBarFill.fillColor = 0xf2c14e;
    else this.pvBarFill.fillColor = 0xff5a6a;

    this.pvText.setText(`PV: ${this.player.pv}/${this.player.pvMax}`);

    if (this.player.weapon.kind === "none") {
      this.weaponText.setText("Weapon: none");
    } else {
      this.weaponText.setText(`Weapon: blaster (ammo ${this.player.weapon.ammo})  Shoot: J`);
    }

    if (this.player.pv <= 0) {
      this.gameOverOverlay.setVisible(true);
    }
  }
}

