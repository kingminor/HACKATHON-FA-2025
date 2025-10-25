import {authFetch, authFetchPost} from "./auth-helper.js";

let groups = {};
let players = {};

function groupClick(e) {
    let id = e.target.id;
    setGroupModal(id);
}

function setGroupModal(groupId) {
    const modal = document.querySelector(".groupManagerModal");
    modal.querySelector("h3").innerText = groups[groupId].name;
    modal.querySelector(".players").innerHTML = playerListDefault();
    modal.querySelector(".players").innerHTML += players[groupId].map((player) => {
        console.log(player);
        return playerTemplate(player.name, player.id, player.tasks, player.points)
    }).join("");

    modal.querySelector(".addPlayerForm").addEventListener("submit", e => {
        e.preventDefault();
        let username = modal.querySelector("#name").value;
        let password = modal.querySelector("#password").value;
        createPlayer(username, password, groupId);
    })

    modal.classList.remove("hide");
    modal.querySelectorAll(".playerName").forEach(playerName => {
        playerName._handler = toggleTasks;
        playerName.addEventListener("click", playerName._handler);
    });
    document.querySelector("#addPlayer").addEventListener("click", (e) => {
        toggleAddPlayerForm(e);
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
    //createPlayer("bobbb", "Bob1111!", "15e6cf57-d69f-4c13-916d-a710e76d97e7");
    await updateGroups();
    updatePlayers();
    let leaderboard = "groups";
    document.querySelector(".groups").id = "selected";
    document.querySelectorAll(".leaderboard").forEach(el => {
        el.addEventListener("click", (e) => {
            leaderboard = setLeaderboard(e);
        })
    })
    document.querySelector(".openNewGroup").addEventListener("click", (e) => {
        openNewGroup();
    })
}

function openNewGroup() {
    const modal = document.querySelector(".newGroupModal");
    modal.classList.remove("hide");
    modal.querySelector("p").addEventListener("click", e => {
        modal.classList.add("hide");
    })
    modal.querySelector("form").addEventListener("submit", e => {
        e.preventDefault();
        const name = modal.querySelector("#groupName").value;
        createGroup(name);
        modal.classList.add("hide");
    })
}

function toggleAddPlayerForm(e) {
    document.querySelector(".addPlayerForm").classList.remove("hide");

    document.querySelector("#addPlayer").removeEventListener("click", toggleAddPlayerForm);
}


async function createGroup(name) {
    let options = {
        body: JSON.stringify(name)
    }
    let response = await authFetchPost("http://localhost:5094/group", options)
    let resJSON = await response.json();
    //console.log(resJSON);
    updateGroups();
}

async function updateGroups() {
    let response = await authFetch("http://localhost:5094/group");
    //console.log(response);
    groups = await response.json();
    //console.log(groups);
    displayGroups();
}

function groupTemplate(name, id) {
    return `
    <div class="group" id="${id}">
        <p>${name}</p>
    </div>
    `
}

async function updatePlayers() {
    const response = await authFetch("http://localhost:5094/person");
    console.log(response);
    const resJSON = await response.json();
    console.log(resJSON);
    Object.entries(groups).forEach(([groupKey]) => {
        console.log(groupKey);
        players[groupKey] = [];
        Object.entries(resJSON).forEach(([key, value]) => {
            if(value.groupId === groupKey) {
                console.log(key);
                players[groupKey].push(value);
            }
        })
    })
    console.log(players);
}

function displayGroups() {
    document.querySelectorAll(".group").forEach(el => {
        el.removeEventListener("click", (e) => groupClick(e))
    });
    const groupList = document.querySelector(".groupViewer");
    groupList.innerHTML = "";
    Object.entries(groups).forEach(([key, value]) => {
        groupList.innerHTML += groupTemplate(value.name, value.id);
    })
    document.querySelectorAll(".group").forEach(el => {
        el.addEventListener("click", (e) => groupClick(e))
    });
}

function playerTemplate(name, id, tasks, points) {
    return `
    <div class="player" id="${id}">
        <div class="playerName">
            <p>${name}</p>
            <svg fill="#000000" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-20.47 -20.47 552.67 552.67" xml:space="preserve" stroke="#000000" stroke-width="20.981135000000002">
                <path d="M508.788,371.087L263.455,125.753c-4.16-4.16-10.88-4.16-15.04,0L2.975,371.087c-4.053,4.267-3.947,10.987,0.213,15.04 c4.16,3.947,10.667,3.947,14.827,0l237.867-237.76l237.76,237.76c4.267,4.053,10.987,3.947,15.04-0.213 C512.734,381.753,512.734,375.247,508.788,371.087z"/>
            </svg>
        </div>
        <ul class="tasks hide">
            <li class="newTask"><a href="./task.html?id=${id}">+ New Task</a></li>
            ${tasks.map((task) => {
                return taskTemplate(task.name, task.points, task.isCompleted)
            }).join("")}
        </ul>
    </div>
    `;
}

function taskTemplate(name, points, isComplete) {
    return `<li class=${isComplete ? '' : 'active'}>${name} (<span>${points}</span>)</li>`;
}

function playerListDefault() {
    return `
    <div class="player" id="addPlayer">
        <p>+ Add Player</p>
        <form class="hide addPlayerForm">
            <div>
                <label for="name">Player Name: </label>
                <input type="text" name="name" id="name" placeholder="Player Name">
                <label for="password">Password:</label>
                <input type="password" name="password" id="password" placeholder="Password">
            </div>
            <button type="submit" class="addPlayerButton">Add Player</button>
        </form>
    </div>
    `
}

async function createPlayer(username, password, groupId) {
    const newUser = {
        Username: username,
        Password: password,
        Role: "User"
    };

    const options = {
        body: JSON.stringify(newUser)
    };

    const response = await authFetchPost("http://localhost:5094/auth/register", {body: JSON.stringify(newUser)});
    //console.log(response);
    const resJSON = await response.json();
    //console.log(resJSON);

    const response2 = await authFetchPost(`http://localhost:5094/person/${resJSON.personId}/groups/${groupId}`, {body: JSON.stringify("")});
    document.querySelector(".groupManagerModal").classList.add("hide");
    await updatePlayers();
    //await window.location.reload();
    //console.log(result);
    //personId
}
init();