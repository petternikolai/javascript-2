import { register } from "../../api/auth/register.js";
import { login } from "../../api/auth/login.js";

/**
 * Handles user authentication process.
 * @param {Event} event - The event object representing the form submission event.
 * @throws {Error} Throws an error if authentication fails.
 */
export async function onAuth(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  try {
    if (event.submitter.dataset.auth === "login") {
      await login(email, password);
      window.location.href = "feed/index.html";
    } else {
      await register(name, email, password);
      window.location.href = "../index.html";
    }
  } catch (error) {
    console.error("Authentication error:", error);

    const passwordInput = event.target.querySelector('[name="password"]');
    const formGroup = passwordInput.closest(".mb-3");

    passwordInput.classList.add("is-invalid");

    let errorMessageElement = formGroup.querySelector(".invalid-feedback");
    if (!errorMessageElement) {
      errorMessageElement = document.createElement("div");
      errorMessageElement.className = "invalid-feedback";
      formGroup.appendChild(errorMessageElement);
    }

    errorMessageElement.textContent =
      "The password is incorrect. Please try again!";
    errorMessageElement.style.display = "block";

    throw new Error("Something went wrong. Please try again!");
  }
}
