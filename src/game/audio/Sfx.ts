export type SfxId = "jump" | "stomp" | "hurt" | "pickup" | "shoot";

export class Sfx {
  // Placeholder for real audio: keep a stable interface so swapping to loaded sound assets is easy.
  public play(_id: SfxId) {
    // Intentionally empty (silent) until real assets are added.
  }
}

