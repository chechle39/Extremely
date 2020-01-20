using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuyInvoiceDetailController : ControllerBase
    {
        private readonly IBuyDetailInvoiceService _buyDetailInvoiceService;
        public BuyInvoiceDetailController(IBuyDetailInvoiceService buyDetailInvoiceService)
        {
            _buyDetailInvoiceService = buyDetailInvoiceService;
        }

        [HttpPost("CreateListBuyDetail")]
        public async Task<IActionResult> CreateListBuyDetail(List<BuyInvDetailViewModel> request)
        {
             await _buyDetailInvoiceService.CreateListBuyDetail(request);
            return Ok(request);
        }

        [HttpPut("UpdateBuyDetail")]
        public async Task<IActionResult> UpdateBuyDetail(List<BuyInvDetailViewModel> request)
        {
            await _buyDetailInvoiceService.UpdateListBuyDetail(request);
            return Ok(request);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> DeletedBuyInvDetail(long id)
        {
            await _buyDetailInvoiceService.Deleted(id);
            return Ok();
        }
    }
}