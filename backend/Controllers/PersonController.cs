using System;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("person")]
public class PersonController : ControllerBase
{
	private readonly PersonService personService = new PersonService();

    public PersonController()
	{
	}

    [HttpGet]
    public ActionResult<Dictionary<Guid, Person>> GetAll()
    {
        return personService.GetAllPeople();
    }

}
