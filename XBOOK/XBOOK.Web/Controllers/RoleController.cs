using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> GetAllRole()
        {
            return Ok(await _roleService.GetAllAsync());
        }
        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] ApplicationRoleViewModel roleVm)
        {
            await _roleService.AddAsync(roleVm);
            return Ok(roleVm);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody]ApplicationRoleViewModel roleVm)
        {
            await _roleService.UpdateAsync(roleVm);
            return Ok(roleVm);
        }
    }
}