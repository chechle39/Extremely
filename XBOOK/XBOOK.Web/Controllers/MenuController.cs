using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Identity;
using XBOOK.Service.Interfaces;
using XBOOK.Web.Claims.System;

namespace XBOOK.Web.Controllers
{
    public class MenuController : BaseAPIController
    {
        private readonly IFunctionsService _functionsService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IPermissionDapper _permissionDapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MenuController(IHttpContextAccessor httpContextAccessor,UserManager<AppUser> userManager, IFunctionsService functionsService,IAuthorizationService authorizationService, IPermissionDapper permissionDapper)
        {
            _httpContextAccessor = httpContextAccessor;
            _functionsService = functionsService;
            _authorizationService = authorizationService;
            _permissionDapper = permissionDapper;
            _userManager = userManager;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllMenu()
        {
            var email = ((ClaimsIdentity)User.Identity).Claims.Where(x => x.Type.Equals("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")).ToList()[0].Value;
            var findUser = await _userManager.FindByEmailAsync(email);
            return Ok(await _permissionDapper.GetMenu(findUser.Id));
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllFunction()
        {
            return Ok(await _functionsService.GetAllFunction());
        }
    }
}