import {
  API_BASE,
  API_POSTS,
  API_QUERY_AUTHOR,
  API_QUERY_COMMENT,
} from "../constants.js";
import { authFetch } from "../fetch.js";

/**
 * Retrieves a list of posts from the server.
 * @param {number} [page=1] - The page number of posts to retrieve.
 * @param {number} [limit] - The maximum number of posts to retrieve per page.
 * @returns {Promise<object>} A promise that resolves to the response data containing the posts.
 * @throws {Error} If the request fails or an error occurs during retrieval.
 */
export async function getPosts(page = 1, limit) {
  let url = `${API_BASE}${API_POSTS}?page=${page}&${API_QUERY_AUTHOR}&${API_QUERY_COMMENT}`;
  if (limit !== undefined) {
    url += `&limit=${limit}`;
  }
  const response = await authFetch(url);
  return await response.json();
}
