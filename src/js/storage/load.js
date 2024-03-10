/**
 * Loads data from local storage.
 * @param {string} key - The key under which the data is stored in local storage.
 * @returns {*} - The parsed data retrieved from local storage, or null if the key doesn't exist.
 */
export function load(key) {
  return JSON.parse(localStorage.getItem(key));
}
