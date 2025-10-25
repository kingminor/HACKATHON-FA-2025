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

    [Authorize(Roles = "User,Admin")]
    [HttpGet]
	public ActionResult<Dictionary<Guid, Group>> GetAllGroups()
	{
		return _groupService.Groups;
    }

	[Authorize(Roles = "User,Admin")]
	[HttpGet("{groupId}")]
	public ActionResult<Group> GetGroupById(Guid groupId)
	{
		Group? group = _groupService.GetGroup(groupId);
		if (group == null)
		{
			return NotFound($"Group with ID {groupId} not found.");
		}
		else
		{
			return group;
		}
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
