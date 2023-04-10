import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "博文",
    icon: "edit",
    prefix: "/posts/",
    children: [
      "skin",
    ],
  },
]);
