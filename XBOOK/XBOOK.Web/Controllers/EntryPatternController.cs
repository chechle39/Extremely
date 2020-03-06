using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
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
    }
}