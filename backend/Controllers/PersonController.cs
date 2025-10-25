using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("person")]
public class PersonController : ControllerBase
{
    private readonly PersonService _personService;

    public PersonController(PersonService personService)
    {
        _personService = personService;
    }

    [HttpGet]
    public ActionResult<Dictionary<Guid, Person>> GetAll()
    {
        return _personService.GetAllPeople();
    }

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

    [HttpPost("assign-group/{personId}/{groupId}")]
    public ActionResult AssignPersonToGroup(Guid personId, Guid groupId)
    {
        bool success = _personService.AssignPersonToGroup(personId, groupId);
        if (!success) return NotFound($"Person {personId} not found.");
        return Ok($"Person {personId} assigned to group {groupId}.");
    }

    [HttpGet("group/{groupId}")]
    public ActionResult<List<Person>> GetPeopleByGroupId(Guid groupId)
    {
        var members = _personService.GetPeopleInGroup(groupId);
        return Ok(members);
    }

}
