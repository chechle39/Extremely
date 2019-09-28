using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
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
        public async Task<IActionResult> GetAllSaleInvDetail()
        {
            var listSaleInvDetail = await _iSaleInvDetailService.GetAllSaleInvoiceDetail();
            return Ok(listSaleInvDetail);
        }
    }
}