﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.Identity;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class UserController : BaseAPIController
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly IUserService _userService;
        private readonly UserManager<AppUser> _userManager;
        public UserController(IUserService userService, UserManager<AppUser> userManager, IAuthorizationService authorizationService)
        {
            _userService = userService;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetUserProFile()
        {
            string UserID = User.Claims.First(x => x.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(UserID);
            return Ok(user);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetUser(UserRequest rq)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "User", Operations.Read);
            if (result.Succeeded == false)
                return new StatusCodeResult((int)System.Net.HttpStatusCode.Forbidden);
            return Ok(await _userService.GetAllAsync(rq));
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

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var model = await _userService.GetById(id);
            return new OkObjectResult(model);
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
                await _userService.DeleteAsync(id);

                return Ok(true);
            }
        }
    }
}