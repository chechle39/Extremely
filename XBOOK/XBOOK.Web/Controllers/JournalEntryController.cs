using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
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
        public async Task<IActionResult> GetAllJournalEntry(DateRequest request)
        {
            return Ok(await _journalEntryService.GetAllJournalEntry(request));
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetDataMap(ClientSerchRequest request)
        {
            var data = await _journalEntryService.GetDataMap(request);
            return Ok(data);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateJournalEntry(JournalEntryModelCreate request)
        {
            return Ok(await _journalEntryService.CreateJournalEntry(request));
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> JournalEntryById(long id)
        {
            return Ok(await _journalEntryService.GetJournalEntryById(id));
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateJournalEntry(JournalEntryModelCreate request)
        {
            return Ok(await _journalEntryService.UpdateJournalEntry(request));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteJournal([FromBody]List<Deleted> request)
        {
            return Ok(await _journalEntryService.DeleteJournalEntry(request));
        }
    }
}