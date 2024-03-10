import { headers } from "../headers.js";
import { getPosts } from "./get.js";

/**
 * Filters and renders posts based on the provided filter value.
 * @param {Array} posts - An array of post objects.
 * @param {string} filterValue - The filter value to apply to the posts.
 */
export function filterPosts(posts, filterValue) {
  // Filter posts based on filter value
  let filteredPosts = posts;
  if (filterValue === "2") {
    filteredPosts.sort((a, b) => new Date(a.created) - new Date(b.created));
  } else if (filterValue === "3") {
    filteredPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (filterValue === "1") {
    filteredPosts.sort((a, b) => b._count.reactions - a._count.reactions);
  } else if (filterValue === "4") {
    filteredPosts.sort((a, b) => a.author.name.localeCompare(b.author.name));
  } else if (filterValue === "5") {
    filteredPosts.sort((a, b) => b.author.name.localeCompare(a.author.name));
  }

  // Render filtered posts
  renderPosts(filteredPosts);
}

/**
 * Renders posts to the DOM.
 * @param {Array} posts - An array of post objects to render.
 * @param {string} [currentUser] - The current user's name.
 */
export function renderPosts(posts, currentUser) {
  const postsContainer = document.querySelector(".list-group");
  postsContainer.innerHTML = "";
  const messageElement = document.getElementById("searchMessage");
  messageElement.classList.add("d-none");

  // If there are no posts, display the message and return
  if (posts.length === 0) {
    messageElement.classList.remove("d-none");
    return;
  }

  // Render posts
  posts.forEach((post) => {
    const postItem = document.createElement("li");
    postItem.classList.add("list-group-item", "p-3", "rounded", "my-2");

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
    authorAvatar.src = post.author.avatar.url;
    authorAvatar.classList.add("feed-picture");
    authorAvatar.alt = post.author.avatar.alt;

    const authorName = document.createElement("p");
    authorName.classList.add("mb-0", "fw-bold");
    authorName.textContent = `@${post.author.name}`;

    authorInfo.appendChild(authorAvatar);
    authorInfo.appendChild(authorName);

    const postDate = document.createElement("p");
    postDate.classList.add("m-0", "text-secondary");
    postDate.textContent = new Date(post.created).toLocaleDateString();

    profileInfo.appendChild(authorInfo);
    profileInfo.appendChild(postDate);

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
      postMedia.classList.add("img-fluid", "rounded");
      postMedia.alt = post.media.alt || "Post image";
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
      post._count.comments > 0 ? ` ${post._count.comments}` : "";
    commentButton.appendChild(commentCount);
    commentContainer.appendChild(commentButton);

    // Create like button
    const likeContainer = document.createElement("div");
    likeContainer.classList.add("col", "text-center");

    const likeButton = createButton("fa-sharp fa-light fa-heart");
    const likeCount = document.createElement("span");
    likeCount.textContent =
      post._count.reactions > 0 ? ` ${post._count.reactions}` : "";
    likeButton.appendChild(likeCount);
    likeContainer.appendChild(likeButton);

    // Create dropdown for update and delete options if the post was made by the current user
    const storedProfile = JSON.parse(localStorage.getItem("profileData"));
    const currentUser = storedProfile.name;
    let dropdownContainer; // Declare dropdownContainer outside the conditional block
    if (currentUser && post.author.name === currentUser) {
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
      updateOption.addEventListener("click", () => updatePost(post.id));
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

    // Append elements to post item
    postItem.appendChild(profileInfo);
    postItem.appendChild(postContent);
    postItem.appendChild(document.createElement("hr"));
    postItem.appendChild(buttonRow);

    // Append post item to posts container
    postsContainer.appendChild(postItem);
  });
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

/**
 * Handles search functionality.
 * @param {string} searchQuery - The search query.
 */
export function handleSearch(searchQuery) {
  searchQuery = searchQuery || "";

  getPosts().then((data) => {
    const posts = data.data;
    const filteredPosts = posts.filter((post) => {
      if (post && post.title && post.body && post.author && post.author.name) {
        return (
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        return false;
      }
    });
    renderPosts(filteredPosts);
  });
}

/**
 * Initializes the document once it's loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Check if the publish button exists before adding event listener
  const publishButton = document.getElementById("button-addon2");
  if (publishButton) {
    publishButton.addEventListener("click", createPost);
  }
});

/**
 * Creates a new post.
 */
async function createPost() {
  const title = document.querySelector('input[placeholder="Title"]').value;
  const body = document.querySelector(
    'textarea[placeholder="Write something awesome"]'
  ).value;
  const pictureUrl = document.querySelector(
    'input[placeholder="Picture URL"]'
  ).value;
  const tags = document
    .querySelector('input[placeholder="Tags"]')
    .value.split(",");

  const requestBody = {
    title: title,
    body: body,
    tags: tags,
  };

  // Add media property if picture URL is provided
  if (pictureUrl) {
    requestBody.media = {
      url: pictureUrl,
    };
  }

  try {
    const response = await fetch("https://v2.api.noroff.dev/social/posts", {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    const responseData = await response.json();
    console.log("Post created successfully:", responseData);
    // Reload the page to display the new post
    window.location.reload();
  } catch (error) {
    console.error("Error creating post:", error);
    // Handle error - display an error message to the user
  }
}
