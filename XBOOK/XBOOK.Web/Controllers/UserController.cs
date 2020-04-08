using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.Identity;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using XBOOK.Web.Extensions;

namespace XBOOK.Web.Controllers
{
    public class UserController : BaseAPIController
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly IUserService _userService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly SignInManager<AppUser> _signInManager;
        public UserController(IUserService userService, SignInManager<AppUser> signInManager, IEmailSender emailSender, UserManager<AppUser> userManager, IAuthorizationService authorizationService)
        {
            _userService = userService;
            _userManager = userManager;
            _authorizationService = authorizationService;
            _emailSender = emailSender;
            _signInManager = signInManager;
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
            var saveEntity = await _userService.AddAsync(userVm);
            if (saveEntity == true)
            {
                try
                {
                    var findUser = await _userManager.FindByEmailAsync(userVm.Email);
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(findUser);
                    await _signInManager.SignInAsync(findUser, isPersistent: false);
                    var callbackUrl = Url.EmailConfirmationLink(findUser.Id, code, Request.Scheme);
                    await _emailSender.SendEmailConfirmationAsync(userVm.Email, callbackUrl);

                } catch(Exception ex)
                {

                }
            
                return Ok(userVm);
            }
            return BadRequest();
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