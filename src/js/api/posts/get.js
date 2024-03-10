import {
  API_BASE,
  API_POSTS,
  API_QUERY_AUTHOR,
  API_QUERY_COMMENT,
} from "../constants.js";
import { authFetch } from "../fetch.js";

/**
 * Retrieves a list of posts from the server.
 * @returns {Promise<object>} A promise that resolves to the response data containing the posts.
 * @throws {Error} If the request fails or an error occurs during retrieval.
 */
export async function getPosts() {
  let url = `${API_BASE}${API_POSTS}?${API_QUERY_AUTHOR}`;
  const response = await authFetch(url);
  return await response.json();
}
