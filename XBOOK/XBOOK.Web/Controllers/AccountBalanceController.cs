using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountBalanceController : ControllerBase
    {
       
        IAccountBalanceServiceDapper _iAccountBalanceServiceDapperr;
        public AccountBalanceController(IAccountBalanceServiceDapper iAccountBalanceServiceDapper)
        {
          
            _iAccountBalanceServiceDapperr = iAccountBalanceServiceDapper;
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllAccountBalanceDapper([FromBody]AccountBalanceSerchRequest request)
        {
            var AccountBalanceList = await _iAccountBalanceServiceDapperr.GetAccountBalanceAsync(request);
            return Ok(AccountBalanceList);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllAccountBalanceAccountDapper([FromBody]AccountBalanceAccNumberSerchRequest request)
        {
            var AccountBalanceList = await _iAccountBalanceServiceDapperr.GetAccountBalanceAcountAsync(request);
            return Ok(AccountBalanceList);
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<AccountBalancePrintModel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine("Reports", "Data");
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