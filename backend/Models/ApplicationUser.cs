using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public Guid? PersonId { get; set; }
}