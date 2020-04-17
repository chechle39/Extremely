using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
namespace XBOOK.Web.Controllers
{
    public class AccountChartController : BaseAPIController
    {
        IAcountChartService _iAccountService;
        private readonly IAuthorizationService _authorizationService;

        public AccountChartController(IAcountChartService iAccountService, IAuthorizationService authorizationService)
        {
            _iAccountService = iAccountService;
            _authorizationService = authorizationService;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllAccount()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Account Chart", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var clientprd = await _iAccountService.GetAllAccount();
            return Ok(clientprd);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllTreeAccount()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Account Chart", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var tree = await _iAccountService.GetAllTreeAccountAsync();
            var x = tree;
            return Ok(x);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteAcount(AccRequest accountNumber)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Account Chart", Operations.Delete);
            if (!result.Succeeded)
                return Unauthorized();
            var tree = await _iAccountService.DeleteAccount(accountNumber);
            return Ok(tree);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateAccountChart(AccountChartViewModel accountChartViewModel)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Account Chart", Operations.Create);
            if (!result.Succeeded)
                return Unauthorized();
            var tree = await _iAccountService.CreateAccountChartAsync(accountChartViewModel);
            return Ok(tree);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> Update(AccountChartViewModel accountNumber)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Account Chart", Operations.Update);
            if (!result.Succeeded)
                return Unauthorized();
            var tree = await _iAccountService.Update(accountNumber);
            return Ok(tree);
        }
    }
}
