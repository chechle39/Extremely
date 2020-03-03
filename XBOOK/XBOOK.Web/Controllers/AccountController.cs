using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Common.Exceptions;
using XBOOK.Data.Identity;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using XBOOK.Web.Extensions;

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
        public AccountController(
            UserManager<AppUser> userManager, 
            IEmailSender emailSender,
             RoleManager<AppRole> roleManager,
            SignInManager<AppUser> signInManager,
            IOptions<ApplicationSetting> applicationSetting,
            IUserService userService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _userService = userService;
            _roleManager = roleManager;
            _applicationSetting = applicationSetting.Value;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Email);
                //var roles = await _userManager.GetRolesAsync(user);
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_applicationSetting.JWT_Secret));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                //var identity = (ClaimsIdentity)User.Identity;
                //IEnumerable<Claim> xxx = identity.Claims;
                //var sss = HttpContext.User.Identity as ClaimsIdentity;
                //var qqqq = identity.Claims.ToList();
                //var claims = new List<Claim>
                //{
                //    new Claim(ClaimTypes.Name, model.Email),
                //    new Claim(ClaimTypes.Role, "Manager"),
                //};
                if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                   var tokenDesscriptor = new SecurityTokenDescriptor
                   {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                            new Claim("UserID", user.Id.ToString())
                        }),
                        Expires = DateTime.UtcNow.AddMinutes(5),
                        SigningCredentials = signinCredentials,
                   };
                    var tokeHandle = new JwtSecurityTokenHandler();
                    var securityToken = tokeHandle.CreateToken(tokenDesscriptor);
                    var token = tokeHandle.WriteToken(securityToken);
                    return Ok(new { token });

                }
                else
                {
                    return Ok(new GenericResult(false, "Username or password incorrect"));
                }

            }

            // If we got this far, something failed, redisplay form
            return BadRequest();
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

        [HttpGet("[action]")]
        [AllowAnonymous]
        public IActionResult ResetPassword(string code = null)
        {
            if (code == null)
            {
                throw new ApplicationException("A code must be supplied for password reset.");
            }
            var model = new ResetPasswordViewModel { Code = code };
            return Ok(model);
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
                // Don't reveal that the user does not exist
                // return RedirectToAction(nameof(ResetPasswordConfirmation));
            }
            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded)
            {
                //  return RedirectToAction(nameof(ResetPasswordConfirmation));
            }
            // AddErrors(result);
            return Ok();
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
                    // Don't reveal that the user does not exist or is not confirmed
                    return Ok(new GenericResult(false, " Please check your email to reset your password"));
                }

                // For more information on how to enable account confirmation and password reset please
                // visit https://go.microsoft.com/fwlink/?LinkID=532713
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                var callbackUrl = Url.ResetPasswordCallbackLink(user.Id, code, Request.Scheme);
                await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                   $"Please reset your password by clicking here: <a href='{callbackUrl}'>link</a>");
                return Ok(new GenericResult(true, " Please check your email to reset your password"));
            }

            // If we got this far, something failed, redisplay form
            return Ok(model);
        }
    }
}