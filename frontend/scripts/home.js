import {authFetch, authFetchPost} from "./auth-helper.js";
import { GetGroupRank, GetRankGlobal, GetRankInGroup } from "./leaderboard-help.js";

const id = sessionStorage.getItem("personId");

async function init() {
    const response = await authFetch(`https://api.pleaseletus.win/person/${id}`);
    const player = await response.json();
    console.log(player);
    const groupResponse = await authFetch(`https://api.pleaseletus.win/group/${player.groupId}`);
    const group = await groupResponse.json();
    console.log(group);

    const inGroupRankingItem = document.querySelector("#inGroupRanking");
    const inGroupRanking = await GetRankInGroup(id, sessionStorage.getItem("groupId"));
    inGroupRankingItem.innerText = inGroupRanking;

    const groupGlobalRankingItem = document.querySelector("#groupGlobalRanking");
    const groupGlobalRanking = await GetGroupRank(sessionStorage.getItem("groupId"));
    groupGlobalRankingItem.innerText = groupGlobalRanking;

    const globalRankingItem = document.querySelector("#globalRanking");
    const globalRanking = await GetRankGlobal(id);
    globalRankingItem.innerText = globalRanking;

    setPage(player, group);
    console.log(player, group);
}

function setPage(player, group) {
    document.querySelector("header > h1").innerText = `${player.name} | ${group.name}`;
    setTodo(player.tasks);
}

function setTodo(todo) {
    console.log(todo);
    const html = todo.map(task => {
        return todoTemplate(task.name, task.points, task.isCompleted)
    }).join("");
    const list = document.querySelector(".todoList");
    list.innerHTML = html;
    list.querySelectorAll("svg").forEach(svg => {
        svg.addEventListener("click", (e) => {completeTodo(e)})
    })
}

function todoTemplate(description, points, completed) {
    return `
        <div class="todoItem ${completed ? "completed" : ""}">
            <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="description"><span class="name">${description}</span> (<span class="points">${points}</span>)</p>
        </div>
    `
}

async function completeTodo(e) {
    const todo = e.target.closest(".todoItem");
    console.log(todo.querySelector(".name").textContent);
    const options = {
        body: JSON.stringify(todo.querySelector(".name").textContent)
    }
    const reponse = await authFetchPost(`https://api.pleaseletus.win/person/${id}/tasks/complete`, options);

    init();
}

init();