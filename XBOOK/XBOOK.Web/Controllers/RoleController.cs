using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class RoleController : BaseAPIController
    {
        private readonly IRoleService _roleService;
        private readonly IAuthorizationService _authorizationService;
        public RoleController(IRoleService roleService, IAuthorizationService authorizationService)
        {
            _roleService = roleService;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllRole(UserRequest rq)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Role", Operations.Read);
            if (result.Succeeded == false)
                return new StatusCodeResult((int)System.Net.HttpStatusCode.Forbidden);
            return Ok(await _roleService.GetAllAsync(rq));
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateRole([FromBody] ApplicationRoleViewModel roleVm)
        {
            await _roleService.AddAsync(roleVm);
            return Ok(roleVm);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Update([FromBody]ApplicationRoleViewModel roleVm)
        {
            await _roleService.UpdateAsync(roleVm);
            return Ok(roleVm);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete(List<Deleted> id)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                await _roleService.DeleteAsync(id);

                return Ok(true);
            }
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var model = await _roleService.GetById(id);

            return new OkObjectResult(model);
        }
    }
}