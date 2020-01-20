using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneralLedgerController : ControllerBase
    {
        IGeneralLedgerService _iGeneralLedgerService;
        public GeneralLedgerController(IGeneralLedgerService iGeneralLedgerService)
        {
            _iGeneralLedgerService = iGeneralLedgerService;
        }
        [HttpPost("[action]")]
        public IActionResult GetCSV([FromBody]genledSearch request)
        {
            Encoding latinEncoding = Encoding.GetEncoding("UTF-8");
          
            var data = _iGeneralLedgerService.GetDataGeneralLedgerAsync(request);
            return File(data, "application/csv", $"latinEncoding.csv");
        }
        [HttpPost("[action]")]
        public IActionResult GetAllGen([FromBody]genledSearch request)
        {
            var data = _iGeneralLedgerService.GetAllGeneralLed(request);
            return Ok(data);
        }
        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<GeneralJournalViewModel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine("Reports", "Data");
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