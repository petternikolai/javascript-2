import { getPosts } from "./get.js";
import { filterPosts, handleSearch } from "./postFunctions.js";

/**
 * Event listener for when the DOM content is loaded.
 * Fetches posts initially and sets up event listeners.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Fetch posts initially
  getPosts()
    .then((data) => {
      const posts = data.data;
      filterPosts(posts, "default"); // Render posts with default filter value
    })
    .catch((error) => console.error("Error fetching posts:", error));

  // Event listener for filter selection
  const selectElement = document.querySelector(".form-select");
  selectElement.addEventListener("change", (event) => {
    const filterValue = event.target.value;
    getPosts()
      .then((data) => {
        const posts = data.data;
        filterPosts(posts, filterValue); // Filter and render posts based on selected value
      })
      .catch((error) => console.error("Error fetching posts:", error));
  });

  // Search button click event handler
  document.getElementById("searchButton").addEventListener("click", (event) => {
    event.preventDefault();
    const searchQuery = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();
    handleSearch(searchQuery);
  });

  // Event listener using event delegation for clicking on comment buttons
  const postsContainer = document.querySelector(".list-group");
  postsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("comment-btn")) {
      const postId = event.target.closest(".post-container").id.split("-")[1];
      showComments(postId);
    }
  });

  // Dynamically updating user profile info in the posts feed
  const storedProfile = JSON.parse(localStorage.getItem("profileData"));
  if (storedProfile) {
    document.getElementById("navProfileName").innerText =
      "@" + `${storedProfile.name}`;
    const avatarImage = document.getElementById("avatarImage");
    avatarImage.src = storedProfile.avatar.url;
    avatarImage.alt = storedProfile.avatar.alt;
  }
});
