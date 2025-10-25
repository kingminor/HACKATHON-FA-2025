import { authFetch } from "./auth-helper";

let params = new URLSearchParams(window.location.search);

let selectedLeaderboard = params.get("type");
document.querySelector(`.${selectedLeaderboard}`).id = "selected";
console.log(selectedLeaderboard);
const leaderboard = await authFetch("http://localhost:5094/leaderboard");
const players = await authFetch("http://localhost:5094/person");
console.log(leaderboard);
console.log(players);

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

function leaderboardItemTemplate(data){
    
}

function UpdateLeaderboard(){

}