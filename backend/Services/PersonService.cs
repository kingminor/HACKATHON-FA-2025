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

    public bool CompletePersonTask(Guid id, string taskName)
    {
        if (people.ContainsKey(id))
        {
            Person person = people[id];
            Task? taskToComplete = person.tasks.FirstOrDefault(t => t.Name == taskName);
            if (taskToComplete != null)
            {
                person.CompleteTask(taskToComplete);
                return true;
            }
        }
        return false;
    }
}