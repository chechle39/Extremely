using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;


namespace XBOOK.Web.Controllers
{
    public class MoneyFundController : BaseAPIController
    {

        IMoneyFundServiceDapper _iMoneyFundServiceDapper;
        public MoneyFundController(IMoneyFundServiceDapper iMoneyFundServiceDapper)
        {

            _iMoneyFundServiceDapper = iMoneyFundServiceDapper;
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> GetALLMoneyFundServiceDapper([FromBody]MoneyFundRequest request)
        {
            var DebitAgeList = await _iMoneyFundServiceDapper.GetIMoneyFundDapperServiceDapperAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetDataMoneyFundReportServiceDapper([FromBody]MoneyFundRequest request)
        {
            var DebitAgeList = await _iMoneyFundServiceDapper.GetIMoneyFundDapperReportServiceDapperAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<MoneyFundViewModelPrintViewodel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine("Reports", "Data");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "MoneyFundReport.json";

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