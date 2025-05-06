import { registerUser, loginUser } from "./auth.js";

/**
 * Initializes register form handling and validation
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

  if (!form || !nameInput || !emailInput || !passwordInput) {
    return;
  }

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
      await registerUser({ name, email, password });
      await loginUser(email, password);
      window.location.href = "/html/dashboard.html";
    } catch (error) {
      emailError.textContent = error.message || "Registration failed";
      emailError.classList.remove("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", handleRegisterForm);