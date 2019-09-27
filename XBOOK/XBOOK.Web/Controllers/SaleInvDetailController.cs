using Microsoft.AspNetCore.Mvc;
using XBOOK.Service.Interfaces;
using XBOOK.Service.ViewModels;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleInvDetailController : ControllerBase
    {
        ISaleInvDetailService _iSaleInvDetailService;
        public SaleInvDetailController(ISaleInvDetailService iSaleInvDetailService)
        {
            _iSaleInvDetailService = iSaleInvDetailService;
        }

        [HttpPost]
        public IActionResult CreateSeleInvDetail(SaleInvDetailViewModel request)
        {
            _iSaleInvDetailService.CreateSaleInvDetail(request);
            return Ok(request);
        }

        [HttpPost("GetAllSaleInvDetail")]
        public IActionResult GetAllSaleInvDetail()
        {
            var listSaleInvDetail = _iSaleInvDetailService.GetAllSaleInvoiceDetail();
            return Ok(listSaleInvDetail);
        }
    }
}