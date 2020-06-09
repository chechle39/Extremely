using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.ViewModels;
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
            var result = await _authorizationService.AuthorizeAsync(User, "Entry Pattern", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();

            var entryData = await _entryPatternService.GetAllEntry();
            return Ok(entryData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllEntryPayment()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Entry Pattern", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();

            var entryData = await _entryPatternService.GetAllEntryPayment();
            return Ok(entryData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> getSearchData()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Entry Pattern", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();

            var searchData = await _entryPatternService.getSearchData();
            return Ok(searchData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> getEntry([FromBody]EntryPatternRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Entry Pattern", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();

            var entryData = await _entryPatternService.getEntry(request);
            return Ok(entryData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateEntry([FromBody]List<EntryPatternViewModel> request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Entry Pattern", Operations.Update);
            if (!result.Succeeded)
                return Unauthorized();

            await _entryPatternService.updateEntryPattern(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> getTransactionType()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Entry Pattern", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();

            return Ok(await _entryPatternService.getTransactionType());
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> getEntryTypeByTransactionType([FromBody]TransactionTypeRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Entry Pattern", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();

            return Ok(await _entryPatternService.getEntryTypeByTransactionType(request));
        }
    }
}