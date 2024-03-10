const API_KEY = "f6b3f2fa-9202-4fa7-a38b-41e1f9b2b358";

/**
 * Function to load data from localStorage.
 * @param {string} key - The key of the item to load from localStorage.
 * @returns {any} The value corresponding to the provided key in localStorage.
 */
function load(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * Function to generate headers for API requests.
 * @param {boolean} [hasBody=false] - Indicates if the request has a body.
 * @returns {Headers} Headers object containing necessary headers for API requests.
 */
function headers(hasBody = false) {
  const headers = new Headers();

  const token = load("token");

  if (token) {
    headers.append("Authorization", `Bearer ${load("token")}`);
  }

  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  if (hasBody) {
    headers.append("Content-Type", "application/json");
  }

  return headers;
}

// Dynamically updating user profile info in the posts feed
const storedProfile = JSON.parse(localStorage.getItem("profileData"));
if (storedProfile) {
  document.getElementById("navProfileName").innerText =
    "@" + `${storedProfile.name}`;
}

/**
 * Updates the user's profile.
 */
async function updateProfile() {
  const bio = document.getElementById("bio").value;
  const avatarUrl = document.getElementById("avatarUrl").value;

  // Construct the request body
  const requestBody = {};
  if (bio) requestBody.bio = bio;
  if (avatarUrl) {
    requestBody.avatar = { url: avatarUrl, alt: "Profile picture" };
  }

  // Send the PUT request to update the profile
  fetchProfileUpdate(requestBody);
}

/**
 * Fetches profile update from the server.
 * @param {object} requestBody - The request body containing profile update data.
 */
async function fetchProfileUpdate(requestBody) {
  const token = localStorage.getItem("token");
  const profile = JSON.parse(localStorage.getItem("profile"));
  const name = profile.name;

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/social/profiles/${name}`,
      {
        method: "PUT",
        headers: headers(true),
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(
        "Failed to update profile: " + responseData.errors[0].message
      );
    }

    // Redirect to the profile page after successful update
    window.location.href = "/profile/index.html";
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}
