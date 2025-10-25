import { authFetch } from "./auth-helper.js";

let params = new URLSearchParams(window.location.search);
let selectedLeaderboard = params.get("type") || "playerGlobal"; // default to playerGlobal

// Map HTML classes to API leaderboard types
const classMap = {
    group: "playerGroup",
    groupGlobal: "groupGlobal",
    playerGlobal: "playerGlobal"
};

// Set initial selected element
const selectedEl = document.querySelector(
    `.${Object.keys(classMap).find(k => classMap[k] === selectedLeaderboard)}`
);
if (selectedEl) {
    selectedEl.id = "selected";
} else {
    console.warn(`No element found for selected leaderboard: ${selectedLeaderboard}`);
}

// Load initial leaderboard
await loadLeaderboard(selectedLeaderboard);

// Add event listeners
document.querySelectorAll(".leaderboard").forEach((el) => {
    el.addEventListener("click", async (e) => {
        selectedLeaderboard = switchLeaderboard(e);
        await loadLeaderboard(selectedLeaderboard);
    });
});

function switchLeaderboard(e) {
    const selectedElement = e.target.closest(".leaderboard");
    const clickedClass = [...selectedElement.classList].find(cls => classMap[cls]);
    const leaderboardType = classMap[clickedClass];

    document.querySelectorAll(".leaderboard").forEach((el) => (el.id = ""));
    selectedElement.id = "selected";

    console.log("Switched to:", leaderboardType);
    return leaderboardType;
}

async function loadLeaderboard(type) {
    let url;
    const groupId = sessionStorage.getItem("groupId");

    switch (type) {
        case "playerGlobal":
            url = "http://localhost:5094/leaderboard/people/global";
            break;
        case "playerGroup":
            if (!groupId) {
                console.warn("No groupId found in sessionStorage");
                UpdateLeaderboard([]);
                return;
            }
            url = `http://localhost:5094/leaderboard/people/group/${groupId}`;
            break;
        case "groupGlobal":
            url = "http://localhost:5094/leaderboard/groups/global";
            break;
        default:
            console.warn(`Unknown leaderboard type: ${type}`);
            return;
    }

    try {
        const response = await authFetch(url);
        const data = response.json ? await response.json() : response;
        console.log(`${type} data:`, data);
        UpdateLeaderboard(data);
    } catch (err) {
        console.error("Error loading leaderboard:", err);
    }
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
    if (!data || data.length === 0) {
        container.innerHTML = `<p class="empty">No leaderboard data available.</p>`;
        return;
    }
    container.innerHTML = data.map((entry) => leaderboardItemTemplate(entry)).join("");
}
