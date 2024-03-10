import { API_AUTH, API_BASE, API_REGISTER } from "../constants.js";
import { authFetch } from "../fetch.js";

/**
 * Registers a new user with the provided name, email, and password.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<object>} A promise that resolves to the response data upon successful registration.
 * @throws {Error} If registration fails.
 */
export async function register(name, email, password) {
  const response = await authFetch(API_BASE + API_AUTH + API_REGISTER, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    return await response.json();
  }

  throw new Error("Could not register the account");
}
