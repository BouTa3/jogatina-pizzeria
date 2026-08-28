import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#b3402c",
  background: "#14160f",
  ink: "#f3ede0",
  muted: "#a9a798",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    id: "scene-01",
    label: "Le four",
    kicker: "Pizzeria Jogatina, Baraki",
    title: "Pétrie à la main. Cuite au feu de bois.",
    body: "De la pâte étirée à la pizza tranchée, tout se joue devant les flammes de notre four à bois.",
    tags: [],
    clip: "/assets/world/scene-01.mp4",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    poster: "/assets/world/scene-01-poster.png",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    scroll: 8,
    mobileScroll: 3,
    linger: 0.2,
  },
];
