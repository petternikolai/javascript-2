import { load } from "../storage/load.js";
import { API_KEY } from "./constants.js";

/**
 * Generates headers for authenticated requests.
 * @param {boolean} [hasBody=false] - Indicates whether the request includes a body.
 * @returns {Headers} - The headers object containing the necessary headers for authentication.
 */
export function headers(hasBody = false) {
  const headers = new Headers();

  const token = load("token");

  if (token) {
    headers.append("Authorization", `Bearer ${load("token")}`);
  }

  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  if (hasBody) {
    headers.append("Content-Type", "application/json");
  }

  return headers;
}
