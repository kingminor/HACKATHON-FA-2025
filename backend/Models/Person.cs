using System.Collections.Generic;


public class Person
{
    public string Name { get; set; }
    public int Points { get; set; }
    public List<Task> tasks { get; set; }

    public Person(string name)
    {
        Name = name;
        Points = 0;
        tasks = new List<Task>();
    }

    public void AddTask(Task task)
    {
        tasks.Add(task);
    }

    public void AddTask(int points, string name)
    {
        Task newTask = new Task
        {
            Name = name,
            Points = points,
            IsCompleted = false
        };
        tasks.Add(newTask);
    }

    public void RemoveTask(Task task)
    {
        tasks.Remove(task);
    }

    public void RemoveTask(string name)
    {
        Task? taskToRemove = tasks.FirstOrDefault(t => t.Name == name);
        if (taskToRemove != null)
        {
            tasks.Remove(taskToRemove);
        }
    }

    public void CompleteTask(Task task)
    {
        if (tasks.Contains(task) && !task.IsCompleted)
        {
            task.IsCompleted = true;
            Points += task.Points;
        }
    }
}