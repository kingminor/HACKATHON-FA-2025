using System.Collections.Generic;


public class Group
{
    public List<Person> people { get; set; }

    public int GetGroupPoints()
    {
        int total = 0;
        foreach(Person person in people)
        {
            person.tasks.ForEach(task =>
            {
                if (task.IsCompleted)
                {
                    total += task.Points;
                }
            });
        }

        return total;
    }

    public Group()
    {
        people = new List<Person>();
    }
}