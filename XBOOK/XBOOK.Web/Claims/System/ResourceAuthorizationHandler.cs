using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Claims.System
{
    public class ResourceAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, string>
    {
        private readonly IRoleService _roleService;

        public ResourceAuthorizationHandler(IRoleService roleService)
        {
            _roleService = roleService;
        }
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, string resource)
        {
            var roles = ((ClaimsIdentity)context.User.Identity).Claims.Where(x => x.Type.Equals("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")).ToList();
            if (roles != null)
            {
                string[] animals = new string[roles.Count()];
                for(int i = 0; i< roles.Count(); i++)
                {
                    animals[i] = roles[i].Value;
                }
                var listRole = animals;
                var hasPermission = await _roleService.CheckPermission(resource, requirement.Name, listRole);
                if (hasPermission)
                {
                    context.Succeed(requirement);
                }
                else
                {
                    context.Fail();
                }
            }
            else
            {
                context.Fail();
            }
        }
    }
}
