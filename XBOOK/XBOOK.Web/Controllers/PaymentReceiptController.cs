using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentReceiptController : ControllerBase
    {
        private readonly IPaymentReceiptService _paymentReceiptService;
        private readonly IPaymentReceiptServiceDapper _paymentReceiptServiceDapper;
        public PaymentReceiptController(IPaymentReceiptService paymentReceiptService, IPaymentReceiptServiceDapper paymentReceiptServiceDapper)
        {
            _paymentReceiptService = paymentReceiptService;
            _paymentReceiptServiceDapper = paymentReceiptServiceDapper;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> CreatePaymentReceipt(PaymentReceiptViewModel request)
        {
            var saveData = await _paymentReceiptService.CreatePaymentReceipt(request);
            return Ok(saveData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdatePaymentReceipt(PaymentReceiptViewModel request)
        {
            var updateData = await _paymentReceiptService.Update(request);
            return Ok(updateData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeletePaymentReceipt(List<requestDeleted> request)
        {
            var removeData = await _paymentReceiptService.DeletedPaymentReceipt(request);
            return Ok(removeData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetLastPaymentReceipt()
        {
            var data = await _paymentReceiptService.GetLastPaymentReceipt();
            return Ok(data);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllPaymentReceipt([FromBody]MoneyReceiptRequest request)
        {
            // var saleListInvoice = await _saleInvoiceService.GetAllSaleInvoice(request);
            var data = await _paymentReceiptServiceDapper.GetPaymentReceipt(request);
            return Ok(data);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreatePaymentReceiptPayMent(PaymentReceiptPayment request)
        {
            var saveData = await _paymentReceiptService.CreatePaymentReceiptPaymentAsync(request);
            return Ok(saveData);
        }
    }
}