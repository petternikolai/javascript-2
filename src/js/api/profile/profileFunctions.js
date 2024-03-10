import { API_BASE, API_PROFILE } from "../constants.js";
import { headers } from "../headers.js";
import { deletePost, updatePost } from "../posts/postFunctions.js";

const token = localStorage.getItem("token"); // Retrieve the stored auth token
const profile = JSON.parse(localStorage.getItem("profileData"));
const urlName = profile.name;

/**
 * Retrieves and displays the user's profile information.
 * @returns {Promise<object|null>} A promise that resolves to the user's profile data if successful, otherwise null.
 */
export async function fetchUserProfile() {
  try {
    const response = await fetch(API_BASE + API_PROFILE + "/" + urlName, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile: " + response.statusText);
    }

    const profileData = await response.json();
    localStorage.setItem("profileData", JSON.stringify(profileData.data)); // Store the profile data
    displayUserProfile(profileData.data);

    // Fetch posts made by the user
    await fetchUserPosts(profileData.data.id); // Await the result

    return profileData.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Displays the user's profile information.
 * @param {object} profile - The user's profile data.
 */
export function displayUserProfile(profile) {
  document.getElementById("profileName").innerText = "@" + `${profile.name}`;
  document.getElementById("navProfileName").innerText = "@" + `${profile.name}`;
  document.getElementById("profileBio").innerText =
    profile.bio || "No bio available.";
  const avatarImage = document.getElementById("avatarImage");
  avatarImage.src = profile.avatar.url;
  avatarImage.alt = profile.avatar.alt;
}

/**
 * Fetches posts made by the user.
 * @param {string} profileId - The ID of the user's profile.
 * @returns {Promise<object[]|null>} A promise that resolves to an array of user's posts if successful, otherwise null.
 */
export async function fetchUserPosts(profileId) {
  try {
    const response = await fetch(
      API_BASE + API_PROFILE + "/" + urlName + "/posts",
      {
        method: "GET",
        headers: headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user posts: " + response.statusText);
    }

    const postData = await response.json();
    renderUserPosts(postData.data); // Assuming postData.data contains user's posts
    return postData.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return null;
  }
}

/**
 * Renders the user's posts.
 * @param {object[]} posts - An array of user's posts.
 */
export function renderUserPosts(posts) {
  const postsContainer = document.querySelector(".user-posts ul.list-group");
  if (!postsContainer) {
    console.error("Posts container not found");
    return;
  }

  postsContainer.innerHTML = ""; // Clear previous posts

  // If there are no posts, display "No posts to see"
  if (posts.length === 0) {
    const noPostsMessage = document.createElement("p");
    noPostsMessage.textContent = "No posts to see";
    postsContainer.appendChild(noPostsMessage);
    return;
  }

  // Render each post
  posts.forEach((post) => {
    const postItem = document.createElement("li");
    postItem.classList.add("list-group-item", "p-3");

    // Profile info
    const profileInfo = document.createElement("div");
    profileInfo.classList.add(
      "profile-info",
      "d-flex",
      "align-items-center",
      "justify-content-between",
      "mb-3"
    );

    // Author information
    const authorInfo = document.createElement("div");
    authorInfo.classList.add("d-flex", "align-items-center", "gap-2");

    const authorAvatar = document.createElement("img");
    authorAvatar.src = profile.avatar.url;
    authorAvatar.classList.add("feed-picture");
    authorAvatar.alt = "Profile picture";

    const authorName = document.createElement("p");
    authorName.classList.add("mb-0", "fw-bold");
    authorName.textContent = "@" + profile.name;

    authorInfo.appendChild(authorAvatar);
    authorInfo.appendChild(authorName);

    const postDate = document.createElement("p");
    postDate.classList.add("m-0", "text-secondary");
    postDate.textContent = new Date(post.created).toLocaleDateString();

    profileInfo.appendChild(authorInfo);
    profileInfo.appendChild(postDate);

    // Post content
    const postContent = document.createElement("div");
    postContent.classList.add("post-content");

    const postTitle = document.createElement("h4");
    postTitle.textContent = post.title || "Untitled";

    const postBody = document.createElement("p");
    postBody.textContent = post.body;

    postContent.appendChild(postTitle);
    postContent.appendChild(postBody);

    const postMedia = document.createElement("img");
    if (post.media) {
      postMedia.src = post.media.url;
      postMedia.classList.add("img-fluid");
      postMedia.alt = post.media.alt || "Post image";
      postContent.appendChild(postMedia);
    }

    const buttonRow = document.createElement("div");
    buttonRow.classList.add("row", "align-items-center");

    // Create comment button
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("col", "text-center");

    const commentButton = document.createElement("button");
    commentButton.classList.add("btn");
    const commentIcon = document.createElement("i");
    commentIcon.classList.add("fa-sharp", "fa-light", "fa-comment");
    commentButton.appendChild(commentIcon);
    const commentCount = document.createElement("span");
    commentCount.textContent =
      post._count.comments > 0 ? ` ${post._count.comments}` : "";
    commentButton.appendChild(commentCount);
    commentContainer.appendChild(commentButton);

    // Create like button
    const likeContainer = document.createElement("div");
    likeContainer.classList.add("col", "text-center");

    const likeButton = document.createElement("button");
    likeButton.classList.add("btn");
    const likeIcon = document.createElement("i");
    likeIcon.classList.add("fa-sharp", "fa-light", "fa-heart");
    likeButton.appendChild(likeIcon);
    const likeCount = document.createElement("span");
    likeCount.textContent =
      post._count.reactions > 0 ? ` ${post._count.reactions}` : "";
    likeButton.appendChild(likeCount);
    likeContainer.appendChild(likeButton);

    buttonRow.appendChild(commentContainer);
    buttonRow.appendChild(likeContainer);

    postItem.appendChild(profileInfo);
    postItem.appendChild(postContent);
    postItem.appendChild(document.createElement("hr"));
    postItem.appendChild(buttonRow);

    postsContainer.appendChild(postItem);

    // Create dropdown gear menu
    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("col", "text-center", "dropdown");

    const dropdownToggle = document.createElement("button");
    dropdownToggle.classList.add("btn", "dropdown-toggle");
    dropdownToggle.setAttribute("type", "button");
    dropdownToggle.setAttribute("data-bs-toggle", "dropdown");
    dropdownToggle.setAttribute("aria-haspopup", "true");
    dropdownToggle.setAttribute("aria-expanded", "false");
    dropdownToggle.innerHTML = '<i class="fa-light fa-gear"></i>';

    const dropdownMenu = document.createElement("div");
    dropdownMenu.classList.add("dropdown-menu");
    dropdownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");

    const updateOption = document.createElement("button");
    updateOption.classList.add("dropdown-item");
    updateOption.textContent = "Update";
    // Add event listener for update option
    updateOption.addEventListener("click", () => {
      // Call the updatePost function with the post ID
      updatePost(post.id);
    });
    dropdownMenu.appendChild(updateOption);

    const deleteOption = document.createElement("button");
    deleteOption.classList.add("dropdown-item", "text-danger");
    deleteOption.textContent = "Delete";
    // Add event listener for delete option
    deleteOption.addEventListener("click", () => {
      // Call the deletePost function with the post ID
      deletePost(post.id);
    });
    dropdownMenu.appendChild(deleteOption);

    dropdownContainer.appendChild(dropdownToggle);
    dropdownContainer.appendChild(dropdownMenu);

    // Append dropdown gear menu to button row
    buttonRow.appendChild(dropdownContainer);
  });
}
