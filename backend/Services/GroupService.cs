using System;
using System.Collections.Generic;
using System.Linq;

public class GroupService
{
    public Dictionary<Guid, Group> Groups { get; set; } = new Dictionary<Guid, Group>();

    public Guid AddGroup(string name)
    {
        var group = new Group { Name = name };
        Groups[group.Id] = group;
        return group.Id;
    }

    public bool RemoveGroup(Guid id)
    {
        return Groups.Remove(id);
    }

    public Group? GetGroup(Guid id)
    {
        return Groups.TryGetValue(id, out var group) ? group : null;
    }

    // Just move GetAllGroups here
    public List<Group> GetAllGroups()
    {
        return Groups.Values.ToList();
    }
}
