/**
 * Saves data to local storage.
 * @param {string} key - The key under which to store the data in local storage.
 * @param {*} value - The data to be stored.
 */
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
