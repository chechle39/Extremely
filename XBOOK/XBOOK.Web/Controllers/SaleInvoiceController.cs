using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleInvoiceController : ControllerBase
    {
        ISaleInvoiceService _saleInvoiceService;
        private readonly IRepository<SaleInvoice> _saleInvoiceUowRepository;
        private readonly IUnitOfWork _uow;

        public SaleInvoiceController(ISaleInvoiceService saleInvoiceService, IUnitOfWork uow)
        {
            _saleInvoiceService = saleInvoiceService;
            _uow = uow;
            _saleInvoiceUowRepository = _uow.GetRepository<IRepository<SaleInvoice>>();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllSaleInvoice([FromBody]SaleInvoiceListRequest request)
        {
            var saleListInvoice = await _saleInvoiceService.GetAllSaleInvoice(request);
            return Ok(saleListInvoice);
        }

        [HttpPut("[action]")]
        public async Task<ActionResult> UpdateSaleInvoice(SaleInvoiceViewModel request)
        {
            await _saleInvoiceService.Update(request);
            return Ok(request);
        }
        [HttpPost("[action]")]
        public ActionResult CreateSaleInvoice(SaleInvoiceModelRequest request)
        {
            var CreateData = _saleInvoiceService.CreateSaleInvoice(request);
            var saleInvoie = _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().LastOrDefault();
            return Ok(saleInvoie);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetSaleInvoiceById(long id)
        {
            var saleListInvoice = await _saleInvoiceService.GetSaleInvoiceById(id);
            return Ok(saleListInvoice);
        }
    }
}