using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Text;

[Route("auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly PersonService _personService;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration, PersonService personService)
    {
        _userManager = userManager;
        _configuration = configuration;
        _personService = personService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var user = new ApplicationUser { UserName = model.Username };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, model.Role);

        if(!string.Equals(model.Role, "Admin", StringComparison.OrdinalIgnoreCase))
        {
            Guid PersonId = _personService.AddPerson(model.Username);
            user.PersonId = PersonId;
            await _userManager.UpdateAsync(user);
        }

        return Ok(new
        {
            Message = "User registered successfully",
            user.PersonId
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByNameAsync(model.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            return Unauthorized("Invalid credentials");

        var roles = await _userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);

        return Ok(new { token });
    }

    [HttpGet("getpersonid")]
    public async Task<IActionResult> GetPersonId([FromQuery] string username)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
            return NotFound("User not found");
        return Ok(new { personId = user.PersonId });
    }

    private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
        };

        if(user.PersonId.HasValue)
        {
            claims.Add(new Claim("personId", user.PersonId.Value.ToString()));
        }

        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
