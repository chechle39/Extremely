using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
        private readonly XBookContext _context;
        public SaleInvoiceController(ISaleInvoiceService saleInvoiceService, IUnitOfWork uow, XBookContext context)
        {
            _saleInvoiceService = saleInvoiceService;
            _uow = uow;
            _saleInvoiceUowRepository = _uow.GetRepository<IRepository<SaleInvoice>>();
            _context = context;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllSaleInvoice([FromBody]SaleInvoiceListRequest request)
        {
            var saleListInvoice = await _saleInvoiceService.GetAllSaleInvoice(request);
            return Ok(saleListInvoice);
        }

        [HttpPut("[action]")]
        public ActionResult UpdateSaleInvoice(SaleInvoiceViewModel request)
        {
            _saleInvoiceService.Update(request);
            return Ok(request);
        }
        [HttpPost("[action]")]
        public ActionResult CreateSaleInvoice(SaleInvoiceModelRequest request)
        {
            var CreateData =  _saleInvoiceService.CreateSaleInvoice(request);
            return Ok(CreateData);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetSaleInvoiceById(long id)
      {
            var saleListInvoice = await _saleInvoiceService.GetSaleInvoiceById(id);
            return Ok(saleListInvoice);
        }

        [HttpPost("[action]")]
        public  IActionResult DeleteSaleInv (List<requestDeleted> deleted)
        {
             _saleInvoiceService.DeletedSaleInv(deleted);
            return Ok();
        }

        [HttpPost("[action]")]
        public  IActionResult GetDF()
        {
            var saleListInvoice =  _saleInvoiceService.GetALlDF();
            return Ok(saleListInvoice);
        }

        [HttpPost("[action]")]
        public IActionResult GetLastIndexInvoiceAsync()
        {
            var saleListInvoice = _saleInvoiceService.GetLastInvoice();
            return Ok(saleListInvoice);
        }
    }
}