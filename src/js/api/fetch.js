import { headers } from "./headers.js";

/**
 * Makes an authenticated fetch request.
 * @param {string} url - The URL to which the fetch request is made.
 * @param {Object} [options={}] - Additional options for the fetch request.
 * @param {boolean} [options.body] - Indicates if the request includes a body.
 * @returns {Promise<Response>} - A Promise that resolves to the Response object representing the response to the request.
 */
export async function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: headers(Boolean(options.body)),
  });
}
