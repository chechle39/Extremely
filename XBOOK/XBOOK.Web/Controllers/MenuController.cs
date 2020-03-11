using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Service.Interfaces;
using XBOOK.Web.Claims.System;

namespace XBOOK.Web.Controllers
{
    public class MenuController : BaseAPIController
    {
        private readonly IFunctionsService _functionsService;
        private readonly IAuthorizationService _authorizationService;
        public MenuController(IFunctionsService functionsService,IAuthorizationService authorizationService)
        {
            _functionsService = functionsService;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllMenu()
        {
          //  var result = await _authorizationService.AuthorizeAsync(User, "Buy invoice", Operations.Read);
            return Ok(await _functionsService.GetMenu(User));
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllFunction()
        {
            return Ok(await _functionsService.GetAllFunction());
        }
    }
}