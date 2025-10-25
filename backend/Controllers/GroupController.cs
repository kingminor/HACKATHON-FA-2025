using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("group")]
public class GroupController : ControllerBase
{
	private readonly GroupService _groupService;

	public GroupController(GroupService groupService)
	{
		_groupService = groupService;
	}

    [Authorize(Roles = "Admin")]
    [HttpPost]
	public ActionResult<Guid> CreateGroup([FromBody] string groupName)
	{
		if (string.IsNullOrWhiteSpace(groupName))
			return BadRequest("Group name cannot be empty.");

		Guid groupId = _groupService.AddGroup(groupName);
		return CreatedAtAction(null, new { groupId }, groupId);
	}
}
