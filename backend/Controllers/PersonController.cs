using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("person")]
public class PersonController : ControllerBase
{
    private readonly PersonService _personService;

    // Constructor
    public PersonController(PersonService personService)
    {
        _personService = personService;
    }

    // Gets all people
    [Authorize(Roles = "User,Admin")]
    [HttpGet]
    public ActionResult<Dictionary<Guid, Person>> GetAll()
    {
        return _personService.GetAllPeople();
    }

    [Authorize(Roles = "User,Admin")]
    [HttpGet("{id}")]
    public ActionResult<Person> GetPersonById(Guid id)
    {
        Person? person = _personService.GetPerson(id);
        if (person == null)
        {
            return NotFound();
        }
        return person;
    }

    //Create a person
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public ActionResult<Guid> CreatePerson([FromBody] string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest("Name cannot be empty.");
        }

        Guid id = _personService.AddPerson(name);
        return CreatedAtAction(nameof(GetPersonById), new { id }, id);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/remove")]
    public ActionResult DeletePerson(Guid id)
    {
        bool success = _personService.RemovePerson(id);
        if (!success)
        {
            return NotFound($"Person of Id {id} not found.");
        }
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/tasks")]
    public ActionResult AddTaskToPerson(Guid id, [FromBody] Task task)
    {
        if (task == null || string.IsNullOrWhiteSpace(task.Name) || task.Points <= 0)
        {
            return BadRequest("Task name and positive points are required.");
        }

        bool success = _personService.AddTaskToPerson(id, task);

        if (!success)
            return NotFound($"Person with ID {id} not found.");

        return Ok($"Task '{task.Name}' added to person {id}.");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/tasks/remove")]
    public ActionResult RemoveTaskFromPerson(Guid id, [FromBody] string taskName)
    {
        if (string.IsNullOrWhiteSpace(taskName))
        {
            return BadRequest("Task name cannot be empty.");
        }

        bool success = _personService.RemoveTaskFromPerson(id, taskName);

        if(!success)
            return NotFound($"Person with ID {id} or task '{taskName}' not found.");
        return Ok($"Task '{taskName}' removed from person {id}.");
    }

    [Authorize(Roles = "User,Admin")]
    [HttpPost("{id}/tasks/complete")]
    public ActionResult CompleteTask(Guid id, [FromBody] string taskName)
    {
        if (string.IsNullOrWhiteSpace(taskName))
        {
            return BadRequest("Task name cannot be empty.");
        }
        bool success = _personService.CompletePersonTask(id, taskName);
        if (!success)
            return NotFound($"Person with ID {id} or task '{taskName}' not found.");
        return Ok($"Task '{taskName}' marked as completed for person {id}.");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("person/{personId}/groups/{groupId}")]
    public ActionResult AssignPersonToGroup(Guid personId, Guid groupId)
    {
        bool success = _personService.AssignPersonToGroup(personId, groupId);
        if (!success) return NotFound($"Person or group not found.");
        return Ok($"Person {personId} assigned to group {groupId}.");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("person/{personId}/groups/{groupId}")]
    public ActionResult RemovePersonFromGroup(Guid, personId, Guid groupId)
    {
        bool success = _personService.RemovePersonFromGroup(personId, groupId);
        if(!success) return NotFound($"Person or group not found.");
        return Ok($"Person {personId} removed from group {groupId}.");
    }

    [Authorize(Roles = "User,Admin")]
    [HttpGet("group/{groupId}")]
    public ActionResult<List<Person>> GetPeopleByGroupId(Guid groupId)
    {
        var members = _personService.GetPeopleInGroup(groupId);
        return Ok(members);
    }

}
