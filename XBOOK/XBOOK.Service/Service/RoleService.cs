using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Data.Identity;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class RoleService : IRoleService
    {
        private RoleManager<AppRole> _roleManager;
        public RoleService(RoleManager<AppRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<bool> AddAsync(ApplicationRoleViewModel roleVm)
        {
            var role = new AppRole()
            {
                Name = roleVm.Name,
                Description = roleVm.Description,
            };
            var result = await _roleManager.CreateAsync(role);
            foreach (var item in roleVm.RequestData)
            {
                await _roleManager.AddClaimAsync(role, new Claim(item.Name, item.Type));
            }

            return result.Succeeded;
        }

        public async Task<List<ApplicationRoleViewModel>> GetAllAsync()
        {
            return await _roleManager.Roles.ProjectTo<ApplicationRoleViewModel>().ToListAsync();
        }

        public async Task UpdateAsync(ApplicationRoleViewModel roleVm)
        {
            var role = await _roleManager.FindByIdAsync(roleVm.Id.ToString());
            role.Description = roleVm.Description;
            role.Name = roleVm.Name;

            var claims = await _roleManager.GetClaimsAsync(role);
            if (roleVm.RequestData.Count > 0)
            {
                foreach (var removingClaim in claims)
                {
                    await _roleManager.RemoveClaimAsync(role, new Claim(removingClaim.Type, removingClaim.Value));
                }
                foreach (var item in roleVm.RequestData)
                {
                    await _roleManager.AddClaimAsync(role, new Claim(item.Name, item.Type));
                }
            }
            else
            {
                foreach (var item in claims)
                {
                    await _roleManager.RemoveClaimAsync(role, new Claim(item.Value, item.Type));
                }
            }
            await _roleManager.UpdateAsync(role);
        }

    }
}
