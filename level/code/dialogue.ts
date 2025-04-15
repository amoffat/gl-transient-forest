import * as host from "@gl/api/w2h/host";
import { String } from "@gl/types/i18n";
import * as timeUtils from "@gl/utils/time";

const log = host.debug.log;
const logError = host.debug.logError;

class State {
  constructor() {}
}

export const state = new State();
const visitCount = new Map<string, u32>();
const choiceToPassage = new Map<string, string>();

function isNight(): bool {
  const ev = host.time.getSunEvent();
  return timeUtils.isNight(ev);
}

function isDay(): bool {
  const ev = host.time.getSunEvent();
  return timeUtils.isDay(ev);
}

function visited(id: string): u32 {
  if (!visitCount.has(id)) {
    return 0;
  }
  const count = visitCount.get(id);
  return count;
}

function hasVisited(id: string): bool {
  return visitCount.has(id);
}

function lastVisited(passage: string): u32 {
  return 0;
}

function random(min: f32, max: f32): f32 {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: f32, max: f32): f32 {
  return Math.random() * (max - min) + min;
}

function either<T>(options: T[]): T {
  const idx = Math.floor(Math.random() * options.length) as u32;
  return options[idx];
}

function incrementVisitCount(id: string): void {
  if (!visitCount.has(id)) {
    visitCount.set(id, 0);
  }
  visitCount.set(id, visitCount.get(id) + 1);
}

export function strings(): String[] {
  return [
    {
      key: "interact",
      values: [
        {
          text: "Interact",
          lang: "en",
        },
      ],
    },

    {
      key: "32c606cd",
      values: [
        {
          text: "Talk to Frog",
          lang: "en",
        },
      ],
    },
  ];
}

/**
 * Called when the player interacts with a choice dialog.
 *
 * @param passageId The id of the passage that the user interacted with.
 * @param passageId The id of the choice that the user made.
 */
export function choiceMadeEvent(passageId: string, choiceId: string): void {
  log(`Choice made for ${passageId}: ${choiceId}`);
  if (choiceToPassage.has(choiceId)) {
    choiceId = choiceToPassage.get(choiceId);
  }
  dispatch(choiceId);
}

export function dispatch(passageId: string): void {
  let found = false;

  if (!found) {
    log(`No passage found for ${passageId}, does it have content?`);
  }
}

