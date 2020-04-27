using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;


namespace XBOOK.Web.Controllers
{
    public class PurchaseReportController : BaseAPIController
    {

        IPurchaseReportDapper _iPurchaseReportDapper;
        private readonly IAuthorizationService _authorizationService;
        public PurchaseReportController(IPurchaseReportDapper iPurchaseReportDapper, IAuthorizationService authorizationService)
        {

            _iPurchaseReportDapper = iPurchaseReportDapper;
            _authorizationService = authorizationService;
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> GetPurchaseReportGroupAsync([FromBody]PurchaseReportSerchRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Purchase Report", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var DebitAgeList = await _iPurchaseReportDapper.GetPurchaseReportGroupAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllPurchaseReportAsync([FromBody]PurchaseReportSerchRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Purchase Report", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var DebitAgeList = await _iPurchaseReportDapper.GetAllPurchaseReportAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<PurchaseReportPrintViewodel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
            var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "PurchaseReport.json";

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