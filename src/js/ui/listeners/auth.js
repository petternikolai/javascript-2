import { onAuth } from "../events/onAuth.js";

/**
 * Sets up an event listener for authentication form submissions.
 */
export function setAuthListener() {
  document.forms.auth.addEventListener("submit", onAuth);
}
