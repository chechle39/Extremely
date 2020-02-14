using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Data.Identity;

namespace XBOOK.Data.Policies
{
    public class AuthorizeClaimRequirementFilter : IAuthorizationFilter
    {
        readonly Claim _claim;
        private RoleManager<AppRole> _roleManager;

        public AuthorizeClaimRequirementFilter(Claim claim, RoleManager<AppRole> roleManager)
        {
            _claim = claim;
            _roleManager = roleManager;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var identity = context.HttpContext.User.Identity as ClaimsIdentity;
            var hasClaim = context.HttpContext.User.Claims.Any(c => c.Value == _claim.Value);
            if (!hasClaim)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
