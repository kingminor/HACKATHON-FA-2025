public class LeaderboardEntry
{
    public Guid PersonId { get; set; }
    public Guid? GroupId { get; set; }
    public int Points { get; set; }
    public string Name { get; set; } = string.Empty;
}