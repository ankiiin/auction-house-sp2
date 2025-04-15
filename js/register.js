/**
 * @file register.js
 * @description Handles user registration form submission and client-side validation for Auction House.
 * @module register
 */

import { registerUser } from "./auth.js";

/**
 * Path to redirect the user to after successful registration.
 * @constant {string}
 */
const LOGIN_REDIRECT = "../index.html";

/**
 * Regular expression for validating general email format.
 * @constant {RegExp}
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Handles the registration form submission and validation.
 * @function handleRegisterForm
 */
function handleRegisterForm() {
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    nameError.classList.add("hidden");
    emailError.classList.add("hidden");
    passwordError.classList.add("hidden");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    if (!name) {
      nameError.textContent = "Name is required";
      nameError.classList.remove("hidden");
      hasError = true;
    }

    if (!emailRegex.test(email) || !email.endsWith("@stud.noroff.no")) {
      emailError.textContent = "Email must be valid and end with @stud.noroff.no";
      emailError.classList.remove("hidden");
      hasError = true;
    }

    if (!password || password.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters";
      passwordError.classList.remove("hidden");
      hasError = true;
    }

    if (hasError) return;

    submitButton.disabled = true;
    submitButton.textContent = "Registering...";

    try {
      await registerUser({ name, email, password });
      window.location.href = LOGIN_REDIRECT;
    } catch (error) {
      alert(`Error: ${error?.message || "Something went wrong. Please try again later."}`);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "SIGN UP";
    }
  });
}

handleRegisterForm();