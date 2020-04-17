using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class JournalEntryController : BaseAPIController
    {
        private readonly IJournalEntryService _journalEntryService;
        private readonly IAuthorizationService _authorizationService;

        public JournalEntryController(IJournalEntryService journalEntryService, IAuthorizationService authorizationService)
        {
            _journalEntryService = journalEntryService;
            _authorizationService = authorizationService;
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
            var result = await _authorizationService.AuthorizeAsync(User, "Journal Entries", Operations.Create);
            if (!result.Succeeded)
                return Unauthorized();
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
            var result = await _authorizationService.AuthorizeAsync(User, "Journal Entries", Operations.Update);
            if (!result.Succeeded)
                return Unauthorized();
            return Ok(await _journalEntryService.UpdateJournalEntry(request));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteJournal([FromBody]List<Deleted> request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Journal Entries", Operations.Delete);
            if (!result.Succeeded)
                return Unauthorized();
            return Ok(await _journalEntryService.DeleteJournalEntry(request));
        }
    }
}