using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class BuyInvoiceDetailController : BaseAPIController
    {
        private readonly IBuyDetailInvoiceService _buyDetailInvoiceService;
        private readonly IAuthorizationService _authorizationService;

        public BuyInvoiceDetailController(IBuyDetailInvoiceService buyDetailInvoiceService,IHttpContextAccessor httpContextAccessor, IAuthorizationService authorizationService)
        {
            _buyDetailInvoiceService = buyDetailInvoiceService;
            _authorizationService = authorizationService;
        }

        [HttpPost("CreateListBuyDetail")]
        public async Task<IActionResult> CreateListBuyDetail(List<BuyInvDetailViewModel> request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Buy invoice", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            await _buyDetailInvoiceService.CreateListBuyDetail(request);
            return Ok(request);
        }

        [HttpPut("UpdateBuyDetail")]
        public async Task<IActionResult> UpdateBuyDetail(List<BuyInvDetailViewModel> request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Buy invoice", Operations.Update);
            if (!result.Succeeded)
                return Unauthorized();
            await _buyDetailInvoiceService.UpdateListBuyDetail(request);
            return Ok(request);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeletedBuyInvDetail(List<Deleted> id)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Buy invoice", Operations.Delete);
            if (!result.Succeeded)
                return Unauthorized();
            await _buyDetailInvoiceService.Deleted(id);
            return Ok();
        }
    }
}