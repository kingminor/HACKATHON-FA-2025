import { authFetch } from "./auth-helper";

let params = new URLSearchParams(window.location.search);

let selectedLeaderboard = params.get("type");
document.querySelector(`.${selectedLeaderboard}`).id = "selected";
console.log(selectedLeaderboard);
authFetch("http://localhost:5094/leaderboard")

document.querySelectorAll(".leaderboard").forEach((el) => {
    el.addEventListener("click", (e) => {
        selectedLeaderboard = switchLeaderboard(e);
    })
})


function switchLeaderboard(e) {
    const selectedElement = e.target.closest(".leaderboard");
    const leaderboardId = selectedElement.classList[1];

    if(leaderboardId === "group") {
        document.querySelector(".groupGlobal").id = "";
        document.querySelector(".playerGlobal").id = "";
        document.querySelector(".group").id = "selected";
    } else if (leaderboardId === "groupGlobal") {
        document.querySelector(".group").id = "";
        document.querySelector(".playerGlobal").id = "";
        document.querySelector(".groupGlobal").id = "selected";
    } else {
        document.querySelector(".groupGlobal").id = "";
        document.querySelector(".group").id = "";
        document.querySelector(".playerGlobal").id = "selected";
    }

    return leaderboardId;

    console.log(leaderboardId);
}