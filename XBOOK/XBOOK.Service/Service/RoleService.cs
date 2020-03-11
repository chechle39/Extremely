using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Identity;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class RoleService : IRoleService
    {
        private RoleManager<AppRole> _roleManager;
        private IRepository<Functions> _functionRepository;
        private IRepository<Permission> _permissionRepository;
        public RoleService(RoleManager<AppRole> roleManager, IRepository<Functions> functionRepository,
         IRepository<Permission> permissionRepository)
        {
            _roleManager = roleManager;
            _functionRepository = functionRepository;
            _permissionRepository = permissionRepository;
        }

        public async Task<bool> AddAsync(ApplicationRoleViewModel roleVm)
        {
            var role = new AppRole()
            {
                Name = roleVm.Name,
                Description = roleVm.Description,
            };
            var result = await _roleManager.CreateAsync(role);
            //foreach (var item in roleVm.RequestData)
            //{
            //    await _roleManager.AddClaimAsync(role, new Claim(item.Name, item.Type));
            //}

            return result.Succeeded;
        }

        public Task<bool> CheckPermission(string functionId, string action, string[] roles)
        {
            var functions = _functionRepository.FindAll();
            var permissions = _permissionRepository.FindAll();
            var query = from f in functions
                        join p in permissions on f.Id equals p.FunctionId
                        join r in _roleManager.Roles on p.RoleId equals r.Id
                        where roles.Contains(r.Name) && f.Id == functionId
                        && ((p.Create && action == "Create")
                        || (p.Update && action == "Update")
                        || (p.Delete && action == "Delete")
                        || (p.Read && action == "Read"))
                        select p;
            return query.AnyAsync();
        }

        public async Task DeleteAsync(List<Deleted> rq)
        {
            foreach (var item in rq)
            {
                var user = await _roleManager.FindByIdAsync(item.id.ToString());
                await _roleManager.DeleteAsync(user);
            }
        }

        public async Task<List<ApplicationRoleViewModel>> GetAllAsync(UserRequest rq)
        {
            if(rq.KeyWord == "")
            {
                return await _roleManager.Roles.ProjectTo<ApplicationRoleViewModel>().ToListAsync();
            }else
            {
                return await _roleManager.Roles.ProjectTo<ApplicationRoleViewModel>().Where(x=>x.Name.Contains(rq.KeyWord)).ToListAsync();
            }
            
        }

        public async Task<ApplicationRoleViewModel> GetById(long id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            var roleClaims = await _roleManager.GetClaimsAsync(role);
            var roleVM = Mapper.Map<AppRole, ApplicationRoleViewModel>(role);
            roleVM.RoleClaims = roleClaims.ToList();
            return roleVM;
        }

        public async Task UpdateAsync(ApplicationRoleViewModel roleVm)
        {
            var role = await _roleManager.FindByIdAsync(roleVm.Id.ToString());
            role.Description = roleVm.Description;
            role.Name = roleVm.Name;

            //var claims = await _roleManager.GetClaimsAsync(role);
            //if (roleVm.RequestData.Count > 0)
            //{
            //    foreach (var removingClaim in claims)
            //    {
            //        await _roleManager.RemoveClaimAsync(role, new Claim(removingClaim.Type, removingClaim.Value));
            //    }
            //    foreach (var item in roleVm.RequestData)
            //    {
            //        await _roleManager.AddClaimAsync(role, new Claim(item.Name, item.Type));
            //    }
            //}
            //else
            //{
            //    foreach (var item in claims)
            //    {
            //        await _roleManager.RemoveClaimAsync(role, new Claim(item.Value, item.Type));
            //    }
            //}
            await _roleManager.UpdateAsync(role);
        }

    }
}
