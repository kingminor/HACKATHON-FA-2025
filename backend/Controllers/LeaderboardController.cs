using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("leaderboard")]
public class LeaderboardController : ControllerBase
{
    private readonly PersonService _personService;

    public LeaderboardController(PersonService personService)
    {
        _personService = personService;
    }

    [HttpGet]
    public ActionResult<List<LeaderboardEntry>> GetLeaderboard()
    {
        var leaderboard = _personService.GetLeaderboard();
        return Ok(leaderboard);
    }
}