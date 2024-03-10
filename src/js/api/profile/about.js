const profile = JSON.parse(localStorage.getItem("profileData"));

document.getElementById("navProfileName").innerText = "@" + `${profile.name}`;
