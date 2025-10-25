import { authFetch } from "./auth-helper.js";

let params = new URLSearchParams(window.location.search);
let selectedLeaderboard = params.get("type") || "playerGlobal"; // default to playerGlobal

// Only set ID if that element exists
const selectedEl = document.querySelector(`.${selectedLeaderboard}`);
if (selectedEl) {
    selectedEl.id = "selected";
} else {
    console.warn(`No element found for .${selectedLeaderboard}`);
}

console.log("Selected leaderboard:", selectedLeaderboard);

// Fetch data
const response = await authFetch("http://localhost:5094/leaderboard/people/global");
const globalLeaderboard = response.json ? await response.json() : response;

console.log(globalLeaderboard);
UpdateLeaderboard(globalLeaderboard);

// Event listeners
document.querySelectorAll(".leaderboard").forEach((el) => {
    el.addEventListener("click", (e) => {
        selectedLeaderboard = switchLeaderboard(e);
    });
});

function switchLeaderboard(e) {
    const selectedElement = e.target.closest(".leaderboard");
    const leaderboardId = selectedElement.classList[1];

    document.querySelectorAll(".leaderboard").forEach((el) => (el.id = ""));
    selectedElement.id = "selected";

    console.log("Switched to:", leaderboardId);
    return leaderboardId;
}

function leaderboardItemTemplate(entry) {
    return `
    <div class="LeaderboardItem">
        <div class="left">
            <p class="username">${entry.name}</p>
        </div>
        <div class="right">
            <p>${entry.points}</p>
        </div>
    </div>`;
}

function UpdateLeaderboard(data) {
    const container = document.querySelector("main");
    container.innerHTML = data.map((entry) => leaderboardItemTemplate(entry)).join("");
}
