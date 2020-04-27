using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using XBOOK.Common.Helpers;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;


namespace XBOOK.Web.Controllers
{
    public class MoneyFundController : BaseAPIController
    {

        IMoneyFundServiceDapper _iMoneyFundServiceDapper;
        private readonly IAuthorizationService _authorizationService;
        public MoneyFundController(IMoneyFundServiceDapper iMoneyFundServiceDapper, IAuthorizationService authorizationService)
        {

            _iMoneyFundServiceDapper = iMoneyFundServiceDapper;
            _authorizationService = authorizationService;
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> GetALLMoneyFundServiceDapper([FromBody]MoneyFundRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Cash Balance", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var DebitAgeList = await _iMoneyFundServiceDapper.GetIMoneyFundDapperServiceDapperAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetDataMoneyFundReportServiceDapper([FromBody]MoneyFundRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Cash Balance", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var DebitAgeList = await _iMoneyFundServiceDapper.GetIMoneyFundDapperReportServiceDapperAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<MoneyFundViewModelPrintViewodel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
            var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "CashBalanceReport.json";

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