import * as host from "@gl/api/w2h/host";
import { String } from "@gl/types/i18n";
import * as timeUtils from "@gl/utils/time";
import * as userDialogue from "../main";

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

export function visited(id: string): u32 {
  if (!visitCount.has(id)) {
    return 0;
  }
  const count = visitCount.get(id);
  return count;
}

export function hasVisited(id: string): bool {
  return visitCount.has(id);
}

export function lastVisited(passage: string): u32 {
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
      key: "7ebaab5d",
      values: [
        {
          text: "Stay away from me!!",
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

    {
      key: "bda18cdb",
      values: [
        {
          text: "Samko",
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
  if (choiceId === "") {
    log(`Passage ${passageId} closed.`);
    userDialogue.dialogClosedEvent(passageId);
    return;
  }
  log(`Choice made for ${passageId}: ${choiceId}`);
  if (choiceToPassage.has(choiceId)) {
    choiceId = choiceToPassage.get(choiceId);
  }
  dispatch(choiceId);
}

export function stage_32c606cd(entered: bool): void {
  if (entered) {
    host.controls.setButtons([
      {
        label: "interact",
        slug: "passage/32c606cd",
      },
    ]);
  } else {
    host.controls.setButtons([]);
  }
}

// Talk to Frog
export function passage_32c606cd(): void {
  // "Samko"
  const title = "bda18cdb";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  const params = new Map<string, string>();
  incrementVisitCount("32c606cd");

  // Stay away from me!!
  text = "7ebaab5d";

  if (text.length > 0) {
    host.text.display("32c606cd", title, text, choices, params, animate);
  }
}

export function dispatch(passageId: string): void {
  let found = false;

  if (passageId === "32c606cd") {
    found = true;
    passage_32c606cd();
  }

  if (!found) {
    log(`No passage found for ${passageId}, does it have content?`);
  }
}

