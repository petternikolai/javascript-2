import { register } from "../../api/auth/register.js";
import { login } from "../../api/auth/login.js";

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
    throw new Error("Something went wrong. Please try again!");
  }
}
