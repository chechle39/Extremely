using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class EntryPatternController : BaseAPIController
    {
        private readonly IEntryPatternService _entryPatternService;
        private readonly IAuthorizationService _authorizationService;
        public EntryPatternController(IEntryPatternService entryPatternService, IAuthorizationService authorizationService)
        {
            _entryPatternService = entryPatternService;
            _authorizationService = authorizationService;
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