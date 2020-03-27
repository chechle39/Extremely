using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Common.Exceptions;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Identity;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using XBOOK.Web.Claims.System;
using XBOOK.Web.Extensions;
using JwtIssuerOptions = XBOOK.Data.Model.JwtIssuerOptions;
using XBOOK.Data.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private RoleManager<AppRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly IUserService _userService;
        private readonly ApplicationSetting _applicationSetting;
        private readonly IJwtFactory _jwtFactory;
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly IPermissionDapper _permissionDapper;
        ICompanyProfileService _iCompanyProfileService;
        private readonly IUserCommonRepository _userCommonRepository;
        public AccountController(
            UserManager<AppUser> userManager,
            IEmailSender emailSender,
             RoleManager<AppRole> roleManager,
            SignInManager<AppUser> signInManager,
            IOptions<ApplicationSetting> applicationSetting,
            IOptions<JwtIssuerOptions> jwtOptions,
            IPermissionDapper permissionDapper,
            IJwtFactory jwtFactory,
            IUserService userService,
            IUserCommonRepository userCommonRepository,
            ICompanyProfileService iCompanyProfileService)
        {
            _jwtOptions = jwtOptions.Value;
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _userService = userService;
            _roleManager = roleManager;
            _applicationSetting = applicationSetting.Value;
            _jwtFactory = jwtFactory;
            _permissionDapper = permissionDapper;
            _iCompanyProfileService = iCompanyProfileService;
            _userCommonRepository = userCommonRepository;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
           
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var dataUserCommon = await _userCommonRepository.FindUserCommon(model.Email);
            if (dataUserCommon == null)
                return  Ok(new GenericResult(false, "Username or password incorrect"));
            var identity = await GetClaimsIdentity(model.Email, model.Password, dataUserCommon.Code);

            if (identity == null)
            {
                return Ok(new GenericResult(false, "Username or password incorrect"));
            }
            var finUser = await _userManager.FindByEmailAsync(model.Email);
            if (finUser.Status == Status.InActive )
            {
                return Ok(new GenericResult(false, "User is not active"));
            }
            var roles = await _userManager.GetRolesAsync(finUser);
            var perList = await _permissionDapper.GetAppFncPermission(finUser.Id);
            var jwt = await XBOOK.Web.Helpers.Tokens.GenerateJwt(identity, _jwtFactory, model.Email, _jwtOptions, new JsonSerializerSettings { Formatting = Formatting.Indented }, roles, perList, finUser.FullName, dataUserCommon.Code);
            return new OkObjectResult(jwt);
        }
        private async Task<ClaimsIdentity> GetClaimsIdentity(string userName, string password, string code)
        {
            
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
                return await Task.FromResult<ClaimsIdentity>(null);

            // get the user to verifty
            var userToVerify = await _userManager.FindByNameAsync(userName);

            if (userToVerify == null) return await Task.FromResult<ClaimsIdentity>(null);

            // check the credentials
            if (await _userManager.CheckPasswordAsync(userToVerify, password))
            {
                return await Task.FromResult(_jwtFactory.GenerateClaimsIdentity(userName, userToVerify.Id.ToString(), code));
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult<ClaimsIdentity>(null);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest() ;
            }
            var user = new AppUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                PhoneNumber = model.PhoneNumber,
                BirthDay = model.BirthDay,
                Status = Status.Active,
                Avatar = string.Empty
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                await _signInManager.SignInAsync(user, isPersistent: false);
                var callbackUrl = Url.EmailConfirmationLink(user.Id, code, Request.Scheme);
                await _emailSender.SendEmailConfirmationAsync(model.Email, callbackUrl);
                return Ok(model);
            }
            return BadRequest();
        }

        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return BadRequest();
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{userId}'.");
            }
            var result = await _userManager.ConfirmEmailAsync(user, code);
            return Ok(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CheckUserAcount()
        {
            return Ok(await _userService.checkUserAcount());
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Ok(model);
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Ok(new GenericResult(false,  "User does not exist"));
            }
            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded)
            {
                return Ok(new GenericResult(true));
            }else
            {
                if (result.Errors.ToList()[0].Code.ToString() == "InvalidToken")
                {
                    return Ok(new GenericResult(false, result.Errors.ToList()[0].Code.ToString()));
                } else
                {
                    return Ok(new GenericResult(false, "xxxx"));
                }
                
            }

        }
        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                {
                    return Ok(new GenericResult(false, user != null ? "User has not confirmed email" : "User does not exist"));
                }

                var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                string codeRS = "";
                string codeReturn="";
                var codeSub = code.Split("/");
                
                int b = 0;
                int j = 0;
                for (int i = 2; i < codeSub.Length; i++)
                {
                    
                    if (codeSub[i].Length > 6)
                    {
                        if ( b == 0)
                        {
                            b++;
                            j = i;
                            codeRS = codeSub[i].Substring(0, codeSub[i].Length + 6 - codeSub[i].Length);
                        }
                       
                    }
                    if (i == 2 && j == 2)
                    {
                        codeReturn += codeSub[0] +"/"+ codeSub[1] + "/"+"b24ctcp" + codeSub[j].Substring( codeSub[j].Length + 6 - codeSub[j].Length);
                    } else if (i == 1 && j != 1)
                    {
                        codeReturn += codeSub[0];
                    } else if (i == j)
                    {
                        codeReturn += "/" + "b24ctcp" + codeSub[j].Substring(codeSub[j].Length + 6 - codeSub[j].Length);
                    } else
                    {
                        codeReturn += "/" + codeSub[i];
                    }
                }
               
                var callbackUrl = Url.ResetPasswordCallbackLink(user.Id, code, Request.Scheme);
                await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                   $"Please reset your password by code: <p>{codeRS}</p>");

                return Ok(new GenericResult(true, codeReturn));
            }
            // If we got this far, something failed, redisplay form
            return Ok(model);
        }
    }
}