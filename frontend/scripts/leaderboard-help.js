import { authFetch } from "./auth-helper.js";

export async function GetRankGlobal(personId){
    const globalLeaderboard = await authFetch("http://localhost:5094/leaderboard/people/global");
    const index = globalLeaderboard.findIndex(person => person.personId === personId);
    return index + 1;
}

export async function GetGroupRank(groupId){
    const groupGlobalLeaderboard = await authFetch("http://localhost:5094/leaderboard/groups/global");
    const index = groupGlobalLeaderboard.findIndex(person => person.personId === personId);
    return index + 1;
}

export async function GetRankInGroup(personId)
{
    const inGroupLeaderboard = await authFetch("http://localhost:5094/leaderboard/people/group/${groupId}");
    const index = inGroupLeaderboard.findIndex(person => person.personId === personId);
    return index + 1;
}