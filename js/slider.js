"use strict";

const sliderTrack = document.querySelector(".slider__track"),
  sliderBody = document.querySelector(".slider__body"),
  sliderArrows = document.querySelector(".slider__arrows"),
  bulletWrap = document.querySelector(".slider__bullets");

const slideWidth = sliderTrack.firstElementChild.clientWidth,
  gap = (sliderTrack.clientWidth - slideWidth * sliderTrack.children.length) / (sliderTrack.children.length - 1);

const moveStep = slideWidth + gap;

let permissionToMove = true,
  currentStep = 1,
  move = 0,
  infiniteSlidesCount = 0;

let posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posFinal = 0,
  posBeforeMove = 0;

const sliderTrackTransition = window.getComputedStyle(sliderTrack).getPropertyValue("transition");

function sliderMount() {
  const sliderBodyWidth = sliderBody.clientWidth;

  const leftMove = currentStep * -moveStep + (sliderBodyWidth * 50) / 100 - slideWidth / 2;

  move = leftMove;

  sliderTrack.style.left = leftMove + "px";
}

function sliderInfinite() {
  const firstSlide = sliderTrack.firstElementChild.cloneNode(true);
  const secondSlide = sliderTrack.children[1].cloneNode(true);
  const thirdSlide = sliderTrack.children[2].cloneNode(true);
  const lastSlide = sliderTrack.lastElementChild.cloneNode(true);
  secondSlide.classList.remove("slide--center");

  sliderTrack.insertBefore(lastSlide, sliderTrack.firstElementChild);
  sliderTrack.appendChild(firstSlide);
  sliderTrack.appendChild(secondSlide);
  sliderTrack.appendChild(thirdSlide);

  infiniteSlidesCount = 4;
  currentStep = 2;
}

function moveRight() {
  if (permissionToMove) {
    const newStep = move - moveStep;

    sliderTrack.style.left = newStep + "px";

    move = newStep;
    currentStep++;

    sliderTrack.children[currentStep - 1].classList.remove("slide--center");
    sliderTrack.children[currentStep].classList.add("slide--center");

    permissionToMove = false;
    posBeforeMove = 0;
  }
}

function moveLeft() {
  if (permissionToMove) {
    const newStep = move + moveStep;

    sliderTrack.style.left = newStep + "px";

    move = newStep;
    currentStep--;

    sliderTrack.children[currentStep + 1].classList.remove("slide--center");
    sliderTrack.children[currentStep].classList.add("slide--center");

    permissionToMove = false;
    posBeforeMove = 0;
  }
}

function handleTransitionSliderTrack() {
  const sliderTrackTD = window.getComputedStyle(sliderTrack).getPropertyValue("transition");
  sliderTrack.style.transition = "unset";
  setTimeout(() => {
    sliderTrack.style.transition = sliderTrackTD;
  }, 1);
}

function handleTransitionSlide(slide) {
  const slideTD = window.getComputedStyle(slide).getPropertyValue("transition");
  slide.style.transition = "unset";
  setTimeout(() => {
    slide.style.transition = slideTD;
  }, 1);
}

function checkIndex() {
  if (currentStep === 1) {
    handleTransitionSliderTrack();

    const preCurrentStep = currentStep;
    currentStep = 9;
    handleTransitionSlide(sliderTrack.children[currentStep]);
    sliderTrack.children[preCurrentStep].classList.remove("slide--center");
    sliderTrack.children[currentStep].classList.add("slide--center");
    sliderMount();
  }

  if (currentStep === 10) {
    handleTransitionSliderTrack();

    const preCurrentStep = currentStep;
    currentStep = 2;
    handleTransitionSlide(sliderTrack.children[currentStep]);
    sliderTrack.children[preCurrentStep].classList.remove("slide--center");
    sliderTrack.children[currentStep].classList.add("slide--center");
    sliderMount();
  }
}

function getTouchEvent(event) {
  return event.type.search("touch") !== -1 ? event.touches[0] : event;
}

function swipeAction(event) {
  posX2 = posX1 - getTouchEvent(event).clientX;
  posBeforeMove += posX2;
  posX1 = getTouchEvent(event).clientX;

  let currMove = sliderTrack.style.left.slice(0, -2);

  sliderTrack.style.left = currMove - posX2 + "px";
}

function swipeEnd() {
  posFinal = posInit - posX1;

  sliderTrack.removeEventListener("touchmove", swipeAction);
  sliderTrack.removeEventListener("touchend", swipeEnd);

  sliderTrack.style.transition = sliderTrackTransition;

  if (slideWidth <= window.innerWidth) {
    if (Math.abs(posBeforeMove) > sliderBody.clientWidth / 2) {
      if (posFinal > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    }
  } else {
    if (Math.abs(posBeforeMove) > sliderBody.clientWidth / 1.2) {
      if (posFinal > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    }
  }
}

function swipeStart(event) {
  posInit = posX1 = getTouchEvent(event).clientX;

  sliderTrack.addEventListener("touchmove", swipeAction);
  sliderTrack.addEventListener("touchend", swipeEnd);

  sliderTrack.style.transition = "unset";
}

window.addEventListener("load", () => {
  handleTransitionSliderTrack();
  sliderInfinite();
  sliderMount();
});

window.addEventListener("resize", () => {
  sliderMount();
});

sliderArrows.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("slider__arrow--left")) {
    moveLeft();
  } else if (target.classList.contains("slider__arrow--right")) {
    moveRight();
  }
});

sliderTrack.addEventListener("transitionend", () => {
  checkIndex();
  permissionToMove = true;
});

sliderTrack.addEventListener("touchstart", (e) => {
  swipeStart(e);
});
