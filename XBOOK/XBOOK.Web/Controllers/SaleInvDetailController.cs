using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class SaleInvDetailController : BaseAPIController
    {
        ISaleInvDetailService _iSaleInvDetailService;
        private readonly XBookContext _context;
        private readonly IAuthorizationService _authorizationService;

        public SaleInvDetailController(ISaleInvDetailService iSaleInvDetailService, XBookContext context, IAuthorizationService authorizationService)
        {
            _iSaleInvDetailService = iSaleInvDetailService;
            _context = context;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public IActionResult CreateSeleInvDetail(SaleInvDetailViewModel request)
        {
            _iSaleInvDetailService.CreateSaleInvDetail(request);
            return Ok(request);
        }

        [HttpPost("GetAllSaleInvDetail")]
        public async Task<IActionResult> GetAllSaleInvDetail()
        {
            var listSaleInvDetail = await _iSaleInvDetailService.GetAllSaleInvoiceDetail();
            return Ok(listSaleInvDetail);
        }

        [HttpPost("CreateListSaleDetail")]
        public IActionResult CreateListSaleDetail(List<SaleInvDetailViewModel> request)
        {
            _iSaleInvDetailService.CreateListSaleDetail(request);
            return Ok(request);
        }

        [HttpPut("UpdateSaleDetail")]
        public IActionResult UpdateSaleDetail(List<SaleInvDetailViewModel> request)
        {
            _iSaleInvDetailService.UpdateListSaleDetail(request);
            return Ok(request);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeletedSaleInvDetail(List<Deleted> id)
        {
           await _iSaleInvDetailService.Deleted(id);
            return Ok();
        }
    }
}