using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JournalDetailController : ControllerBase
    {
        private readonly IJournalDetailService _journalDetailService;
        public JournalDetailController(IJournalDetailService journalDetailService)
        {
            _journalDetailService = journalDetailService;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteJournalDetail([FromBody]List<Deleted> request)
        {
            return Ok(await _journalDetailService.DeleteJournalEntryDetail(request));
        }
    }
}