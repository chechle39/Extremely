using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Data.Interfaces;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JournalEntryController : ControllerBase
    {
        private readonly IJournalEntryService _journalEntryService;
        public JournalEntryController(IJournalEntryService journalEntryService)
        {
            _journalEntryService = journalEntryService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllJournalEntry()
        {
            return Ok(await _journalEntryService.GetAllJournalEntry());
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetDataMap()
        {
            return Ok(await _journalEntryService.GetDataMap());
        }
    }
}