using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using XBOOK.Common.Helpers;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class GeneralLedgerController : BaseAPIController
    {
        IGeneralLedgerService _iGeneralLedgerService;
        private readonly IAuthorizationService _authorizationService;
        public GeneralLedgerController(IGeneralLedgerService iGeneralLedgerService, IAuthorizationService authorizationService)
        {
            _iGeneralLedgerService = iGeneralLedgerService;
            _authorizationService = authorizationService;
        }
        [HttpPost("[action]")]
        public IActionResult GetCSV([FromBody]genledSearch request)
        {
            Encoding latinEncoding = Encoding.GetEncoding("UTF-8");
          
            var data = _iGeneralLedgerService.GetDataGeneralLedgerAsync(request);
            return File(data, "application/csv", $"latinEncoding.csv");
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllGen([FromBody]genledSearch request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "General Journal", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var data = _iGeneralLedgerService.GetAllGeneralLed(request);
            return Ok(data);
        }
        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<GeneralJournalViewModel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
            var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "GeneralJournal.json";

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