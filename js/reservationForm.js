"use strict";

const bookForm = document.querySelector(".book-form");
const bookInputs = document.querySelectorAll(".book-form__input");
const bookSubmit = document.querySelector(".book-form__submit");

const popupTransition = 0.5; //* 0.5 second

function createPopup(input, content, parentClass) {
  if (!input.parentElement.querySelector(`.${parentClass}__popup-hint`)) {
    const popup = document.createElement("div");

    popup.classList.add(`${parentClass}__popup-hint`);
    popup.classList.add(`${parentClass}__popup-hint--hidden`);
    popup.style.display = "block";
    popup.style.transition = `${popupTransition}s`;
    popup.innerText = content;

    input.parentElement.appendChild(popup);

    setTimeout(() => {
      popup.classList.remove(`${parentClass}__popup-hint--hidden`);
    }, 100);
  } else {
    removePopup(input, parentClass);
    setTimeout(() => {
      createPopup(input, content, parentClass);
    }, popupTransition * 1000);
  }
}

function removePopup(input, parentClass) {
  if (input.parentElement.querySelector(`.${parentClass}__popup-hint`)) {
    const popup = input.parentElement.querySelector(`.${parentClass}__popup-hint`);

    popup.classList.add(`${parentClass}__popup-hint--hidden`);

    setTimeout(() => {
      popup.remove();
    }, popupTransition * 1000);
  }
}

function inputMakeValid(input, parentClass) {
  input.classList.remove(`${parentClass}__input--invalid`);
  input.classList.add(`${parentClass}__input--valid`);
}

function inputMakeInvalid(input, parentClass) {
  input.classList.remove(`${parentClass}__input--valid`);
  input.classList.add(`${parentClass}__input--invalid`);
}

function resetForm(form, parentClass) {
  form.querySelectorAll("input").forEach((input) => {
    input.classList.remove(`${parentClass}__input--valid`);
    input.previousElementSibling.style.visibility = "visible";
  });

  form.reset();
}

function inputMatch(input, regEx, parentClass) {
  if (input.value.match(regEx)) {
    inputMakeValid(input, parentClass);

    return true;
  } else {
    inputMakeInvalid(input, parentClass);

    return false;
  }
}

function validate(input, parentClass) {
  switch (true) {
    case input.classList.contains(`${parentClass}__name`): {
      const regEx = /^[^\d]+$/;
      const matchResult = inputMatch(input, regEx, parentClass);
      let content = "";

      if (input.value.length === 0 || input.value === " ") {
        content = "Please fill out this field";
      } else {
        content = "The name must contain Latin letters only";
      }

      return {
        matchResult: matchResult,
        content: content,
      };
    }

    case input.classList.contains(`${parentClass}__email`): {
      const regEx = /[-.\w]+@([\w-]+\.)+[\w-]+/g;
      const matchResult = inputMatch(input, regEx, parentClass);
      let content = "";

      if (input.value.length === 0 || input.value === " ") {
        content = "Please fill out this field";
      } else {
        content = "Email must contain a domen(E.g. @gmail.com)";
      }

      return {
        matchResult: matchResult,
        content: content,
      };
    }

    case input.classList.contains(`${parentClass}__persons`): {
      const regEx = /^\d+$/;
      let matchResult = inputMatch(input, regEx, parentClass);
      let content = "";

      if (matchResult) {
        if (input.value > 140) {
          inputMakeInvalid(input, parentClass);
          matchResult = false;
          content = "We have 140 seats only";
        } else {
          inputMakeValid(input, parentClass);
        }
      } else if (input.value.length === 0 || input.value === " ") {
        content = "Please fill out this field";
      } else {
        content = "Only numbers are allowed";
      }

      return {
        matchResult: matchResult,
        content: content,
      };
    }

    case input.classList.contains(`${parentClass}__time`): {
      const regEx = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM|am|pm)$/g;
      const matchResult = inputMatch(input, regEx, parentClass);
      let content = "";

      if (input.value.length === 0 || input.value === " ") {
        content = "Please fill out this field";
      } else {
        content = "The time must be in 12h HH:MM AM/PM format (E.g. 6:23 PM, 12:25 PM)";
      }

      return {
        matchResult: matchResult,
        content: content,
      };
    }

    case input.classList.contains(`${parentClass}__date`): {
      const regEx = /^(0[1-9]|1[0-2])\.([0-2][0-9]|3[01])$/g;
      const matchResult = inputMatch(input, regEx, parentClass);
      let content = "";

      if (input.value.length === 0 || input.value === " ") {
        content = "Please fill out this field";
      } else {
        content = "The date must be in MM:DD format (E.g. 06.27)";
      }

      return {
        matchResult: matchResult,
        content: content,
      };
    }
  }
}

function addInputAnimation(input, parentClass) {
  input.addEventListener("focus", () => {
    input.previousElementSibling.style.opacity = ".5";
  });

  input.addEventListener("focusout", () => {
    input.previousElementSibling.style.opacity = "1";

    if (!input.value) input.previousElementSibling.style.visibility = "visible";

    const validateResult = validate(input, parentClass);

    if (validateResult.matchResult) {
      removePopup(input, parentClass);
    } else {
      createPopup(input, validateResult.content, parentClass);
    }
  });

  input.addEventListener("input", () => {
    input.previousElementSibling.style.visibility = "hidden";
  });
}

export { validate, addInputAnimation, resetForm };

bookInputs.forEach((input) => {
  const parentClass = `book-form`;

  addInputAnimation(input, parentClass);
});

bookSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  const url = "https://jsonplaceholder.typicode.com/posts";
  let body = {};

  const parentClass = `book-form`;

  let validateResultArray = [];
  let allowToFetch = false;

  bookInputs.forEach((input) => {
    validateResultArray.push(validate(input, parentClass).matchResult);
  });

  validateResultArray.includes(false) ? (allowToFetch = false) : (allowToFetch = true);

  if (!allowToFetch) {
    alert("Please fill out all the fields");
  } else {
    bookInputs.forEach((input) => {
      let a = input.getAttribute("id").slice(11);

      body[a] = input.value;
    });

    console.log(body);

    fetch(url, {
      method: "POST",
      body: body,
    })
      .then((response) => {
        if (response.ok) {
          alert("The data has been sent");
          console.log(response.status);
        } else {
          alert(`An error has occured code: ${response.status}`);
          console.log(response.status);
        }
      })
      .catch((error) => {
        alert(`An error has occured code: ${response.status}`);
        console.log(error);
      });

    resetForm(bookForm, parentClass);
  }
});
