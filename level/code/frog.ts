import { SetAnimationOpts } from "@gl/api/types/animation";
import { LoadAndPlaySoundOpts } from "@gl/api/types/sound";
import * as host from "@gl/api/w2h/host";
import { Animator, AnimatorOpts, lerp } from "@gl/utils/animation";
import { easeInOutQuad, easeOutQuart } from "@gl/utils/easing";
import { Vec2 } from "@gl/utils/la/vec2";

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
  moveAnim: Animator;
  jumpAnim: Animator;
  _startPos: Vec2;
  name: string;
  private _jumpVec: Vec2 = new Vec2(0, 0);
  private _posInitialized: bool = false;
  private _flip: bool = false;

  constructor(refId: i32, name: string) {
    this.asyncId = refId;
    this.name = name;

    const moveOpts = new AnimatorOpts();
    moveOpts.duration = 1000;
    moveOpts.forwardCurve = easeInOutQuad;
    this.moveAnim = new Animator(moveOpts);

    const jumpOpts = new AnimatorOpts();
    jumpOpts.duration = moveOpts.duration;
    jumpOpts.forwardCurve = easeOutQuart;
    jumpOpts.reverseCurve = easeOutQuart;
    jumpOpts.pingPong = true;
    this.jumpAnim = new Animator(jumpOpts);

    this._startPos = new Vec2(0, 0);
  }

  jump(vec: Vec2): void {
    this._startPos = this.curPos;
    this._jumpVec = vec;
    this.state = JumpState.StartJump;
    this._flip = vec.x > 0;
    this.advance();
  }

  get idle(): boolean {
    return this.state == JumpState.Idle;
  }

  get curPos(): Vec2 {
    return host.npc.getPos(this.name).toVec2();
  }

  advance(): void {
    switch (this.state) {
      case JumpState.StartJump:
        this.state = JumpState.Airborne;
        host.npc.flip(this.name, this._flip, false);

        const jumpAnimOpts = new SetAnimationOpts();
        jumpAnimOpts.name = "Jump";
        jumpAnimOpts.durationMs = this.jumpAnim.duration;
        host.npc.setAnimation(this.asyncId, this.name, jumpAnimOpts);

        const jumpOpts = new LoadAndPlaySoundOpts();
        jumpOpts.name = "frog-jump.ogg";
        jumpOpts.delayMs = 50;
        host.sound.loadAndPlaySound(jumpOpts);

        this.moveAnim.play();
        this.jumpAnim.play();
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

        const landAnimOpts = new SetAnimationOpts();
        landAnimOpts.name = "Idle";
        landAnimOpts.durationMs = this.jumpAnim.duration;
        landAnimOpts.loop = true;
        host.npc.setAnimation(this.asyncId, this.name, landAnimOpts);
        break;
    }
  }

  tick(deltaMS: f32): void {
    if (!this._posInitialized) {
      this._startPos = host.npc.getPos(this.name).toVec2();
      this._posInitialized = true;
    }

    this.moveAnim.tick(deltaMS);
    this.jumpAnim.tick(deltaMS);

    const newPos = this._startPos.lerped(
      this._startPos.added(this._jumpVec),
      this.moveAnim.progress
    );
    const height = lerp(0, this._jumpVec.magnitude / 2, this.jumpAnim.progress);
    host.npc.setPos(this.name, newPos.x, newPos.y, height);
  }
}
