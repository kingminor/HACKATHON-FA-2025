using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("leaderboard")]
public class LeaderboardController : ControllerBase
{
    private readonly PersonService _personService;
    private readonly GroupService _groupService;

    public LeaderboardController(PersonService personService, GroupService groupService)
    {
        _personService = personService;
        _groupService = groupService;
    }


    [Authorize(Roles = "User,Admin")]
    [HttpGet("people/global")]
    public ActionResult GetGlobalPlayerLeaderboard()
    {
        return Ok(_personService.GetGlobalPlayerLeaderboard());
    }

    [Authorize(Roles = "User,Admin")]
    [HttpGet("people/group/{groupId}")]
    public ActionResult GetGroupPlayerLeaderboard(Guid groupId)
    {
        return Ok(_personService.GetGroupPlayerLeaderboard(groupId));
    }

    [Authorize(Roles = "User,Admin")]
    [HttpGet("groups/global")]
    public ActionResult GetGlobalGroupLeaderboard()
    {
        return Ok(_personService.GetGlobalGroupLeaderboard(_groupService.GetAllGroups()));
    }
}
