using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntryPatternController : ControllerBase
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
    }
}