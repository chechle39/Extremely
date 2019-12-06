using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneralLedgerGroupController : ControllerBase
    {
        IGeneralLedgerGroupService _iGeneralLedgerService;
        public GeneralLedgerGroupController(IGeneralLedgerGroupService iGeneralLedgerService)
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
    }
}