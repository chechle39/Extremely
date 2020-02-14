using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetUser()
        {
            return Ok(await _userService.GetAllAsync());
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SaveEntity(ApplicationUserViewModel userVm)
        {
            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            await _userService.AddAsync(userVm);
            return Ok(userVm);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> Update([FromBody]ApplicationUserViewModel userVm)
        {
            await _userService.UpdateAsync(userVm);
            return Ok(userVm);
        }
    }
}