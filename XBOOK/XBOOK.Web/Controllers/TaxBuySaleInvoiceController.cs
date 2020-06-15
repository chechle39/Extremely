using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Base;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaxBuySaleInvoiceController : BaseAPIController
    {
       // ICompanyProfileService _iCompanyProfileService;
        ITaxBuySaleInvoiceService _taxBuySaleInvoiceService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IUnitOfWork _uow;
        ITaxBuyInvoiceServiceDapper _taxBuyInvoiceServiceDapper;
        public TaxBuySaleInvoiceController(
            // ICompanyProfileService iCompanyProfileService,
            ITaxBuySaleInvoiceService taxBuySaleInvoiceService,
            IUnitOfWork uow,
            ITaxBuyInvoiceServiceDapper taxBuyInvoiceServiceDapper,
            IAuthorizationService authorizationService)
        {
            _taxBuySaleInvoiceService = taxBuySaleInvoiceService;
            _taxBuyInvoiceServiceDapper = taxBuyInvoiceServiceDapper;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllTaxBuySaleInvoice([FromBody]SaleInvoiceListRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Invoice", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var taxSaleListInvoice = await _taxBuyInvoiceServiceDapper.GetTaxBuyInvoiceAsync(request);
            return Ok(taxSaleListInvoice);
        }

        [HttpPost("[action]")]
        public ActionResult CreateTaxBuySaleInvoice(TaxSaleInvoiceModelRequest request)
        {
            var result = _authorizationService.AuthorizeAsync(User, "Invoice", Operations.Create);
            if (!result.Result.Succeeded)
                return Unauthorized();
            var CreateData = _taxBuySaleInvoiceService.CreateTaxInvoice(request);
            return Ok(CreateData);
        }
    }
}