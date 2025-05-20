import * as host from "@gl/api/w2h/host";
import { String } from "@gl/types/i18n";
import * as twine from "@gl/utils/twine";
import * as level from "../main";

const log = host.debug.log;
const logError = host.debug.logError;

class State {
  constructor() {}
}

export const state = new State();

// If we're using an alias on our link, then we need to map from our shown
// choice id to our alias choice id.
const choiceToPassage = new Map<string, string>();

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
    level.dialogClosedEvent(passageId);
    return;
  }
  log(`Choice made for ${passageId}: ${choiceId}`);
  if (choiceToPassage.has(choiceId)) {
    choiceId = choiceToPassage.get(choiceId);
  }
  dispatch(choiceId);
}

// Show interact button for "Talk to Frog"
export function stage_Samko(entered: bool): void {
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

// "Talk to Frog"
export function passage_Samko(): void {
  // "Samko"
  const title = "bda18cdb";
  const animate = true;
  let text = "";
  const choices: string[] = [];
  const params = new Map<string, string>();
  twine.incrementVisitCount("32c606cd");

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
    passage_Samko();
  }

  if (!found) {
    log(`No passage found for ${passageId}, does it have content?`);
  }
}

