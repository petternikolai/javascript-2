import { API_BASE, API_POSTS } from "../constants.js";

export async function getPosts() {
  const response = await authFetch(API_BASE + API_POSTS);
  return await response.json();
}
