using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllRole(UserRequest rq)
        {
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