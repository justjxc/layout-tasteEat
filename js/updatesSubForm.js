"use strict";

const updatesForm = document.querySelector(".updates-form");
const updatesEmail = document.querySelector(".updates-form__email");
const updatesSubmit = document.querySelector(".updates-form__submit");

import { validate, addInputAnimation, resetForm } from "./reservationForm.js";

const parentClass = `updates-form`;

addInputAnimation(updatesEmail, parentClass);

updatesSubmit.addEventListener("click", (event) => {
  event.preventDefault();

  const url = "https://jsonplaceholder.typicode.com/posts";
  const email = updatesSubmit.value;

  const parentClass = `updates-form`;

  const allowToFetch = validate(updatesEmail, parentClass).matchResult;

  console.log(allowToFetch);

  if (!allowToFetch) {
    alert("Please fill out the field");
  } else {
    console.log(email);

    fetch(url, {
      method: "POST",
      body: email,
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

    resetForm(updatesForm, parentClass);
  }
});
