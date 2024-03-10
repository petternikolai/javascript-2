import { API_BASE, API_POSTS, API_QUERY_AUTHOR } from "../constants.js";
import { headers } from "../headers.js";

const profile = JSON.parse(localStorage.getItem("profileData"));

document.getElementById("navProfileName").innerText = "@" + `${profile.name}`;

// Function to fetch post data from the server based on ID
async function fetchPost(postId) {
  try {
    const response = await fetch(
      `${API_BASE}${API_POSTS}/${postId}?${API_QUERY_AUTHOR}`,
      {
        headers: headers(),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }
    const post = await response.json();
    console.log("Post data:", post); // Add this line to log the retrieved post data
    return post;
  } catch (error) {
    throw error;
  }
}

/**
 * Renders a single post to the DOM.
 * @param {Object} post - The post object to render.
 */
export function renderPost(post) {
  const postsContainer = document.querySelector(".list-group");
  const messageElement = document.getElementById("searchMessage");
  messageElement.classList.add("d-none");

  // Clear existing content
  postsContainer.innerHTML = "";

  // Create post item
  const postItem = document.createElement("li");
  postItem.classList.add("list-group-item", "p-3", "rounded", "my-2");

  // Create profile info
  const profileInfo = document.createElement("div");
  profileInfo.classList.add(
    "profile-info",
    "d-flex",
    "align-items-center",
    "justify-content-between",
    "mb-3"
  );

  const authorInfo = document.createElement("div");
  authorInfo.classList.add("d-flex", "align-items-center", "gap-2");

  const authorAvatar = document.createElement("img");
  authorAvatar.src = post.data.author.avatar.url;
  authorAvatar.classList.add("feed-picture");
  authorAvatar.alt = post.data.author.avatar.alt;

  const authorName = document.createElement("p");
  authorName.classList.add("mb-0", "fw-bold");
  authorName.textContent = `@${post.data.author.name}`;

  authorInfo.appendChild(authorAvatar);
  authorInfo.appendChild(authorName);

  const postDate = document.createElement("p");
  postDate.classList.add("m-0", "text-secondary");
  postDate.textContent = new Date(post.data.created).toLocaleDateString();

  profileInfo.appendChild(authorInfo);
  profileInfo.appendChild(postDate);

  // Append profile info to post item
  postItem.appendChild(profileInfo);

  // Create post content
  const postContent = document.createElement("div");
  postContent.classList.add("post-content");

  const postTitle = document.createElement("h4");
  postTitle.textContent = post.data.title || "Untitled";

  const postBody = document.createElement("p");
  postBody.textContent = post.data.body;

  postContent.appendChild(postTitle);
  postContent.appendChild(postBody);

  const postMedia = document.createElement("img");
  if (post.data.media) {
    postMedia.src = post.data.media.url;
    postMedia.classList.add("img-fluid", "rounded");
    postMedia.alt = post.data.media.alt || "Post image";
    postContent.appendChild(postMedia);
  }

  const buttonRow = document.createElement("div");
  buttonRow.classList.add("row", "align-items-center");

  // Create comment button
  const commentContainer = document.createElement("div");
  commentContainer.classList.add("col", "text-center");

  const commentButton = createButton("fa-sharp fa-light fa-comment");
  const commentCount = document.createElement("span");
  commentCount.id = `comment-count-${post.id}`;
  commentCount.textContent =
    post._count?.comments > 0 ? ` ${post._count.comments}` : ""; // Add null check
  commentButton.appendChild(commentCount);
  commentContainer.appendChild(commentButton);

  // Create like button
  const likeContainer = document.createElement("div");
  likeContainer.classList.add("col", "text-center");

  const likeButton = createButton("fa-sharp fa-light fa-heart");
  const likeCount = document.createElement("span");
  likeCount.textContent =
    post._count?.reactions > 0 ? ` ${post._count.reactions}` : ""; // Add null check
  likeButton.appendChild(likeCount);
  likeContainer.appendChild(likeButton);

  // Create dropdown for update and delete options if the post was made by the current user
  const storedProfile = JSON.parse(localStorage.getItem("profileData"));
  const currentUser = storedProfile?.name;
  let dropdownContainer; // Declare dropdownContainer outside the conditional block
  if (
    currentUser &&
    post.data.author &&
    post.data.author.name === currentUser
  ) {
    dropdownContainer = document.createElement("div");
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
    updateOption.addEventListener("click", () => {
      console.log("postId:", post.data.id); // For debugging
      updatePost(post.data.id); // Replace this line
    });

    dropdownMenu.appendChild(updateOption);

    const deleteOption = document.createElement("button");
    deleteOption.classList.add("dropdown-item", "text-danger");
    deleteOption.textContent = "Delete";
    deleteOption.addEventListener("click", () => deletePost(post.id));
    dropdownMenu.appendChild(deleteOption);

    dropdownContainer.appendChild(dropdownToggle);
    dropdownContainer.appendChild(dropdownMenu);
  }

  buttonRow.appendChild(commentContainer);
  buttonRow.appendChild(likeContainer);
  // Append elements to button row
  if (dropdownContainer) {
    // Append dropdownContainer only if it's defined
    buttonRow.appendChild(dropdownContainer);
  }
  postItem.appendChild(postContent); // Corrected variable name
  postItem.appendChild(document.createElement("hr"));
  postItem.appendChild(buttonRow);

  // Append post item to posts container
  postsContainer.appendChild(postItem);
}

// Function to create button element
function createButton(iconClass) {
  const button = document.createElement("button");
  button.classList.add("btn");
  const icon = document.createElement("i");
  icon.classList.add(...iconClass.split(" "));
  button.appendChild(icon);
  return button;
}

// postDetail.js
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve post ID from query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");
  if (!postId) {
    console.error("postId is undefined");
    return; // or handle the error accordingly
  }
  // Fetch post data based on the ID
  fetchPost(postId)
    .then((post) => {
      // Populate post details on the page
      renderPost(post);
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
      // Handle error - display an error message to the user
    });
});

/**
 * Deletes a post from the server.
 * @param {number} postId - The ID of the post to delete.
 */
export async function deletePost(postId) {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/social/posts/${postId}`,
      {
        method: "DELETE",
        headers: headers(true),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    // Reload the page after deleting the post
    window.location.reload();
  } catch (error) {
    console.error("Error deleting post:", error);
    // Handle error - display an error message to the user
  }
}

/**
 * Updates a post on the server.
 * @param {number} postId - The ID of the post to update.
 */
export async function updatePost(postId) {
  // Get the post data from the API
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/social/posts/${postId}`,
      {
        headers: headers(), // Assuming headers function provides authentication headers
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }
    const postData = await response.json();

    // Populate the modal fields with the current post data
    document.getElementById("updateTitle").value = postData.data.title;
    document.getElementById("updateBody").value = postData.data.body;
    document.getElementById("updatePictureUrl").value =
      postData.data.media?.url || "";
    document.getElementById("updateTags").value =
      postData.data.tags?.join(",") || "";

    // Show the modal
    const updateModal = new bootstrap.Modal(
      document.getElementById("updateModal")
    );
    updateModal.show();

    // Add event listener to the update button in the modal
    document
      .getElementById("updateButton")
      .addEventListener("click", async () => {
        const updatedTitle = document.getElementById("updateTitle").value;
        const updatedBody = document.getElementById("updateBody").value;
        const updatedPictureUrl =
          document.getElementById("updatePictureUrl").value;
        const updatedTags = document
          .getElementById("updateTags")
          .value.split(",");

        const requestBody = {
          title: updatedTitle,
          body: updatedBody,
          tags: updatedTags,
        };

        // Add media property if picture URL is provided
        if (updatedPictureUrl) {
          requestBody.media = {
            url: updatedPictureUrl,
          };
        }

        try {
          const updateResponse = await fetch(
            `https://v2.api.noroff.dev/social/posts/${postId}`,
            {
              method: "PUT",
              headers: headers(true),
              body: JSON.stringify(requestBody),
            }
          );

          if (!updateResponse.ok) {
            throw new Error("Failed to update post");
          }
          // Reload the page after updating the post
          window.location.reload();
        } catch (error) {
          console.error("Error updating post:", error);
          // Handle error - display an error message to the user
        }
      });
  } catch (error) {
    console.error("Error fetching post data:", error);
    // Handle error - display an error message to the user
  }
}
