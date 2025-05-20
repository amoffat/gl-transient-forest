import { Card } from "@gl/types/card";

// This is your level card. It powers the `Credits` link on your level. As you
// add collaborators, include their details so they get credited for their work.
// If you use any assets that require attribution (like many Creative Commons
// licenses), include those as well.
export function card(): Card {
  return {
    level: {
      name: "Transient Forest",
      version: 1,
    },
    source: "https://github.com/amoffat/gl-transient-forest",
    credits: [
      {
        name: "Andrew",
        role: "Author",
        link: "https://x.com/GetLostTheGame",
      },
      {
        name: "TransientCode",
        role: "Tileset Artist",
        link: "https://x.com/TransientCode",
      },
      {
        name: "LimeZu",
        role: "Tileset Artist",
        link: "https://limezu.itch.io/",
      },
      {
        name: "Pixel-boy",
        role: "Tileset Artist",
        link: "https://x.com/2Pblog1",
      },
      {
        name: "Ben Burnes",
        role: "Music",
        link: "https://x.com/ben_burnes",
      },
    ],
  };
}
