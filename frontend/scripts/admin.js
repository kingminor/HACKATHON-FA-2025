import { authFetch } from "./auth-helper.js";

const players = authFetch("http://localhost:5094/person");
console.log(players);

function groupClick(e) {
    let id = e.target.id;
    setGroupModal(id);
}

function setGroupModal(groupId) {
    const modal = document.querySelector(".groupManagerModal");
    modal.classList.remove("hide");

    modal.querySelectorAll(".playerName").forEach(playerName => {
        playerName._handler = toggleTasks;
        playerName.addEventListener("click", playerName._handler);
    });

    const closeBtn = modal.querySelector(".groupTitle > p");
    const handleClose = () => {
        modal.classList.add("hide");

        const cleanup = () => {
            modal.querySelectorAll(".playerName").forEach(playerName => {
                if (playerName._handler) {
                    playerName.removeEventListener("click", playerName._handler);
                    delete playerName._handler;
                }
            });
            modal.querySelector("#addPlayer > form").classList.add("hide");
            modal.querySelectorAll(".tasks").forEach(el => {
                el.classList.add("hide");
            });

            modal.removeEventListener("transitionend", cleanup);
        };

        modal.addEventListener("transitionend", cleanup, { once: true });
    };

    closeBtn.addEventListener("click", handleClose);
}


function toggleTasks(e) {
    const player = e.target.closest(".player");
    console.log(player);
    console.log(player.querySelector(".tasks"));
    player.querySelector("svg").classList.toggle("rotated");
    player.querySelector(".tasks").classList.toggle("hide");
}

function setLeaderboard(e) {
    console.log(e.target.classList);
    const type = e.target.classList[1];
    if(type === "groups") {
        document.querySelector(".leaderboard.players").id = ""
        document.querySelector(".leaderboardRanking").style.borderTopLeftRadius = "0px";
        document.querySelector(".leaderboardRanking").style.borderTopRightRadius = "10px";
    } else {
        document.querySelector(".leaderboard.groups").id = ""
        document.querySelector(".leaderboardRanking").style.borderTopRightRadius = "0px";
        document.querySelector(".leaderboardRanking").style.borderTopLeftRadius = "10px";
    }
    e.target.id = "selected";
    return type;
}

async function init() {
    let groups = await authFetch("http://localhost:5094/group");
    console.log(groups.json());
    document.querySelectorAll(".group").forEach(el => {
        el.addEventListener("click", (e) => groupClick(e))
    });
    let leaderboard = "groups";
    document.querySelectorAll(".groups").id = "selected";
    document.querySelectorAll(".leaderboard").forEach(el => {
        el.addEventListener("click", (e) => {
            leaderboard = setLeaderboard(e);
        })
    })
    document.querySelector("#addPlayer").addEventListener("click", (e) => {
        toggleAddPlayerForm(e);
    })
}

function toggleAddPlayerForm(e) {
    document.querySelector(".addPlayerForm").classList.remove("hide");

    document.querySelector("#addPlayer").removeEventListener("click", toggleAddPlayerForm);
}

init();