using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Data.Identity;
using XBOOK.Data.ViewModels;
using XBOOK.Web.Claims.System;

namespace XBOOK.Web.Controllers
{
    public class SeedController : BaseAPIController
    {
        private readonly UserManager<AppUser> _userManager;
        private RoleManager<AppRole> _roleManager;

        public SeedController(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager) 
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateAdminRole()
        {
            var adminRole = await _roleManager.FindByNameAsync("Admin");
            if (adminRole == null)
            {
                adminRole = new AppRole()
                {
                    Name = "Admin"
                };
                var result = await _roleManager.CreateAsync(adminRole);
                if (result.Succeeded)
                {
                    await addClaimsToRole(adminRole);
                    return Ok();
                }
                else
                {
                    return StatusCode(500, result.Errors);
                }
            }
            else
            {
                await addClaimsToRole(adminRole);
                return Ok();
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddUserToAdminRole([FromBody]requestEmail email)
        {
            var user = await _userManager.FindByEmailAsync(email.email);
            if (user == null)
            {
                return StatusCode(404, $"User with email: {email.email} not found");
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Any(p => p.Equals("Admin", StringComparison.OrdinalIgnoreCase)))
            {
                return Ok("User already belong to Admin role");
            }

            var result = await _userManager.AddToRoleAsync(user, "Admin");
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return StatusCode(500, result.Errors);
            }
        }

        private async Task addClaimsToRole(AppRole role)
        {
            var claims = await _roleManager.GetClaimsAsync(role);
            if (false == claims.Any(p => p.Value.Equals(Authority.ROLE_VIEW)))
            {
                await _roleManager.AddClaimAsync(role, new Claim(ClaimTypes.AuthorizationDecision, Authority.ROLE_VIEW));
            }
            if (false == claims.Any(p => p.Value.Equals(Authority.ROLE_EDIT)))
            {
                await _roleManager.AddClaimAsync(role, new Claim(ClaimTypes.AuthorizationDecision, Authority.ROLE_EDIT));
            }
        }
    }
}