using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Web.Controllers
{
    public class AccountBalanceController : BaseAPIController
    {
       
        IAccountBalanceServiceDapper _iAccountBalanceServiceDapperr;
        private readonly IAuthorizationService _authorizationService;
        public AccountBalanceController(IAccountBalanceServiceDapper iAccountBalanceServiceDapper, IAuthorizationService authorizationService)
        {
          
            _iAccountBalanceServiceDapperr = iAccountBalanceServiceDapper;
            _authorizationService = authorizationService;
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllAccountBalanceDapper([FromBody]AccountBalanceSerchRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Account Balance", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var AccountBalanceList = await _iAccountBalanceServiceDapperr.GetAccountBalanceAsync(request);
            return Ok(AccountBalanceList);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllAccountBalanceAccountDapper([FromBody]AccountBalanceAccNumberSerchRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Account Balance", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var AccountBalanceList = await _iAccountBalanceServiceDapperr.GetAccountBalanceAcountAsync(request);
            return Ok(AccountBalanceList);
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<AccountBalancePrintModel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
            var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "AccountBalance.json";

            var fullPath = Path.Combine(pathToSave, fileName);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }
            System.IO.File.WriteAllText(fullPath, json);

            return Ok();
        }

    }
}