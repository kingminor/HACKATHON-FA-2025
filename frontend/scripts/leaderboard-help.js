import { authFetch } from "./auth-helper.js";

export async function GetRankGlobal(personId) {
    const res = await authFetch("https://api.pleaseletus.win/leaderboard/people/global");
    const leaderboard = await res.json();
    const index = leaderboard.findIndex(person => person.personId === personId);
    return index + 1;
}

export async function GetGroupRank(groupId) {
    const res = await authFetch("https://api.pleaseletus.win/leaderboard/groups/global");
    const leaderboard = await res.json();
    const index = leaderboard.findIndex(group => group.groupId === groupId);
    return index + 1;
}

export async function GetRankInGroup(personId, groupId) {
    const res = await authFetch(`https://api.pleaseletus.win/leaderboard/people/group/${groupId}`);
    const leaderboard = await res.json();
    const index = leaderboard.findIndex(person => person.personId === personId);
    return index + 1;
}
