using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class EntryPatternController : BaseAPIController
    {
        private readonly IEntryPatternService _entryPatternService;
        public EntryPatternController(IEntryPatternService entryPatternService)
        {
            _entryPatternService = entryPatternService;
            
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllEntry()
        {
            var entryData = await _entryPatternService.GetAllEntry();
            return Ok(entryData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllEntryPayment()
        {
            var entryData = await _entryPatternService.GetAllEntryPayment();
            return Ok(entryData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> getSearchData()
        {
            var searchData = await _entryPatternService.getSearchData();
            return Ok(searchData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> getEntry([FromBody]EntryPatternRequest request)
        {
            var entryData = await _entryPatternService.getEntry(request);
            return Ok(entryData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateEntry([FromBody]List<EntryPatternViewModel> request)
        {
            await _entryPatternService.updateEntryPattern(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<List<string>> getTransactionType()
        {
            return await _entryPatternService.getTransactionType();
        }

        [HttpPost("[action]")]
        public async Task<List<string>> getEntryTypeByTransactionType([FromBody]TransactionTypeRequest request)
        {
            return await _entryPatternService.getEntryTypeByTransactionType(request);
        }
    }
}