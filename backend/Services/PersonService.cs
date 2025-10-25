using System.Collections.Generic;
using System.Linq;


public class PersonService
{
    public Dictionary<Guid, Person> people { get; set; }
    public PersonService()
    {
        people = new Dictionary<Guid, Person>();
    }

    public Guid AddPerson(string name)
    {
        Guid id = Guid.NewGuid();
        var newPerson = new Person(name) { Id = id };
        people.Add(id, newPerson);
        return id;
    }


    public Person? GetPerson(Guid id)
    {
        if (people.ContainsKey(id))
        {
            return people[id];
        }
        return null;
    }

    public Dictionary<Guid, Person> GetAllPeople()
    {
        return people;
    }

    public bool RemovePerson(Guid id)
    {
        return people.Remove(id);
    }

    public bool PersonExists(Guid id)
    {
        return people.ContainsKey(id);
    }

    public bool UpdatePersonName(Guid id, string newName)
    {
        if (people.ContainsKey(id))
        {
            people[id].Name = newName;
            return true;
        }
        return false;
    }

    public bool AddTaskToPerson(Guid id, Task task)
    {
        if (people.ContainsKey(id))
        {
            people[id].AddTask(task);
            return true;
        }
        return false;
    }

    public bool RemoveTaskFromPerson(Guid id, string taskName)
    {
        if(!people.ContainsKey(id))
            return false;
        var person = people[id];
        var taskToRemove = person.tasks
            .FirstOrDefault(t => string.Equals(t.Name, taskName.Trim(), StringComparison.OrdinalIgnoreCase));
        if (taskToRemove == null)
            return false;
        person.RemoveTask(taskToRemove);
        return true;
    }

    public bool CompletePersonTask(Guid id, string taskName)
    {
        if (!people.ContainsKey(id))
            return false;

        var person = people[id];

        var taskToComplete = person.tasks
            .FirstOrDefault(t => string.Equals(t.Name, taskName.Trim(), StringComparison.OrdinalIgnoreCase));

        if (taskToComplete == null)
            return false;

        person.CompleteTask(taskToComplete);
        return true;
    }

    public bool AssignPersonToGroup(Guid personId, Guid groupId)
    {
        if (!people.ContainsKey(personId)) return false;

        people[personId].GroupId = groupId;
        return true;
    }

    public bool RemovePersonFromGroup(Guid personId)
    {
        if (!people.ContainsKey(personId)) return false;
        people[personId].GroupId = null;
        return true;
    }

    public List<Person> GetPeopleInGroup(Guid groupId)
    {
        return people.Values.Where(p => p.GroupId == groupId).ToList();
    }

    public List<LeaderboardEntry> GetLeaderboard()
    {
        return people.Values
            .Select(p => new LeaderboardEntry
            {
                PersonId = p.Id,
                GroupId = p.GroupId,
                Points = p.Points
            })
            .OrderByDescending(e => e.Points)
            .ToList();
    }

}