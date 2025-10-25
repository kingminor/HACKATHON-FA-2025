import { authFetch } from "./auth-helper.js";

let params = new URLSearchParams(window.location.search);
let selectedLeaderboard = params.get("type") || "playerGlobal";

// Set initial selected
document.querySelector(`.${selectedLeaderboard}`).id = "selected";

async function loadLeaderboard(type, groupId = null) {
    let url;
    if (type === "playerGlobal") {
        url = "http://localhost:5094/leaderboard/people/global";
    } else if (type === "groupGlobal") {
        url = "http://localhost:5094/leaderboard/groups/global";
    } else if (type === "group") {
        if (!groupId) return; // need a groupId
        url = `http://localhost:5094/leaderboard/people/group/${groupId}`;
    } else {
        return;
    }

    const data = await authFetch(url);
    UpdateLeaderboard(data);
}

// Initial load
loadLeaderboard(selectedLeaderboard);

// Handle tab clicks
document.querySelectorAll(".leaderboard").forEach((el) => {
    el.addEventListener("click", (e) => {
        selectedLeaderboard = switchLeaderboard(e);
        // For group leaderboard, you need to pass groupId if required
        loadLeaderboard(selectedLeaderboard);
    });
});

function switchLeaderboard(e) {
    const selectedElement = e.target.closest(".leaderboard");
    const leaderboardId = selectedElement.classList[1];

    document.querySelectorAll(".leaderboard").forEach(el => el.id = "");
    selectedElement.id = "selected";

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
    const container = document.querySelector("#leaderboardContainer");
    container.innerHTML = data.map(leaderboardItemTemplate).join("");
}
