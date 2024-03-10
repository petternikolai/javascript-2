import { setAuthListener } from "../ui/listeners/auth.js";

/**
 * Sets up the home page by adding authentication event listeners.
 */
export async function homePage() {
  setAuthListener();
}
