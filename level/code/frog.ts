import { LoadAndPlaySoundOpts } from "@gl/api/types/sound";
import * as host from "@gl/api/w2h/host";

export enum JumpState {
  Idle,
  StartJump,
  Airborne,
  Land,
  EndJump,
}

export class FrogState {
  asyncId: i32 = 0;
  state: JumpState = JumpState.Idle;

  constructor(refId: i32) {
    this.asyncId = refId;
  }

  jump(): void {
    this.state = JumpState.StartJump;
    this.advance();
  }

  get idle(): boolean {
    return this.state == JumpState.Idle;
  }

  advance(): void {
    switch (this.state) {
      case JumpState.StartJump:
        this.state = JumpState.Airborne;
        host.npc.setAnimation(this.asyncId, "james", "Jump", false);
        const jumpOpts = new LoadAndPlaySoundOpts();
        jumpOpts.name = "frog-jump.ogg";
        jumpOpts.delayMs = 50;
        host.sound.loadAndPlaySound(jumpOpts);
        break;
      case JumpState.Airborne:
        this.state = JumpState.Land;
        const landOpts = new LoadAndPlaySoundOpts();
        landOpts.asyncId = this.asyncId;
        landOpts.name = "frog-land.ogg";
        host.sound.loadAndPlaySound(landOpts);
        break;
      case JumpState.Land:
        this.state = JumpState.Idle;
        host.npc.setAnimation(this.asyncId, "james", "Idle", true);
        break;
    }
  }
}
