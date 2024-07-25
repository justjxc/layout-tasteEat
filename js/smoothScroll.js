"use strict";

const headerLinks = document.querySelectorAll(".header__link");
const heroLink = document.querySelector(".hero__link");
const linksToScroll = [...headerLinks, heroLink];

linksToScroll.forEach((link) => {
  const ID = link.getAttribute("href").slice(1);

  link.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById(ID).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});
