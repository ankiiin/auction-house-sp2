/**
 * @file login.js
 * @description Handles login form submission, client-side validation, and redirects upon success.
 */

import { loginUser } from "./auth.js";

/**
 * Initializes login form handling and validation
 * @function handleLoginForm
 */
function handleLoginForm() {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    emailError.classList.add("hidden");
    passwordError.classList.add("hidden");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    if (!email.endsWith("@stud.noroff.no")) {
      emailError.textContent = "Email must end with @stud.noroff.no";
      emailError.classList.remove("hidden");
      hasError = true;
    }

    if (!password || password.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters";
      passwordError.classList.remove("hidden");
      hasError = true;
    }

    if (hasError) return;

    try {
      await loginUser(email, password);
      window.location.href = "./html/feed.html";
    } catch (error) {
      emailError.textContent = "Invalid email or password";
      emailError.classList.remove("hidden");
    }
  });
}

handleLoginForm();