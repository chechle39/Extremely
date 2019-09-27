using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;
using XBOOK.Service.ViewModels;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleInvoiceController : ControllerBase
    {
        ISaleInvoiceService _saleInvoiceService;
        public SaleInvoiceController(ISaleInvoiceService saleInvoiceService)
        {
            _saleInvoiceService = saleInvoiceService;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string keyword, string startDate, string endDate, bool searchConditions)
        {
            var saleListInvoice = await _saleInvoiceService.GetAllSaleInvoice(keyword, startDate, endDate, searchConditions);
            return Ok(saleListInvoice);
        }

        [HttpPut]
        public ActionResult UpdateSaleInvoice(SaleInvoiceViewModel request)
        {
            var updateData = _saleInvoiceService.Update(request);
            return Ok(request);
        }
        [HttpPost]
        public ActionResult CreateSaleInvoice(SaleInvoiceModelRequest request)
        {
            var CreateData = _saleInvoiceService.CreateSaleInvoice(request);
            return Ok(request);
        }
    }
}