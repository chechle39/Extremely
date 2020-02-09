using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountDetailController : ControllerBase
    {

        IAccountDetailServiceDapper _iAccountDetailServiceDapper;
        public AccountDetailController(IAccountDetailServiceDapper iAccountDetailServiceDapper)
        {

            _iAccountDetailServiceDapper = iAccountDetailServiceDapper;
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllAccountDetailAsync([FromBody]AccountDetailSerchRequest request)
        {
            var DebitAgeList = await _iAccountDetailServiceDapper.GetAccountDetailAsync(request);
            return Ok(DebitAgeList);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAccountDetailReportAsync([FromBody]AccountDetailSerchRequest request)
        {
            var DebitAgeList = await _iAccountDetailServiceDapper.GetAccountDetailReportAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<AccountDetailPrintViewModel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine("Reports", "Data");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "AccountDetail.json";

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