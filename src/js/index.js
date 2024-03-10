import { getPosts } from "./api/posts/get.js";
import { homePage } from "./routes/home.js";

/**
 * Sets up the home page by initializing necessary components and data.
 */
homePage();

/**
 * Retrieves posts from the API and renders them.
 * @returns {Promise} A promise that resolves once the posts are fetched and rendered.
 */
getPosts();
