using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("group")]
public class GroupController : ControllerBase
{
	private readonly GroupService _groupService;

	public GroupController(GroupService groupService)
	{
		_groupService = groupService;
	}

	[HttpPost]
	public ActionResult<Guid> CreateGroup([FromBody] string groupName)
	{
		if (string.IsNullOrWhiteSpace(groupName))
			return BadRequest("Group name cannot be empty.");

		Guid groupId = _groupService.AddGroup(groupName);
		return CreatedAtAction(null, new { groupId }, groupId);
	}
}
