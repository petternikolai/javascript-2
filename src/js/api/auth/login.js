import { save } from "../../storage/save.js";
import { API_AUTH, API_BASE, API_LOGIN } from "../constants.js";
import { authFetch } from "../fetch.js";

/**
 * Logs in the user with the provided email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<object>} A promise that resolves to the user profile data upon successful login.
 * @throws {Error} If login fails.
 */
export async function login(email, password) {
  const response = await authFetch(API_BASE + API_AUTH + API_LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { accessToken, ...profile } = (await response.json()).data;
    save("token", accessToken);
    save("profileData", profile);
    return profile;
  }

  throw new Error("Could not login the account");
}
