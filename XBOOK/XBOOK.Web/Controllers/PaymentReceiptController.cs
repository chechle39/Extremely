using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class PaymentReceiptController : BaseAPIController
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

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetPaymentReceiptById(long id)
        {
            return Ok(await _paymentReceiptService.GetPaymentReceiptById(id));
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<PaymentReceiptPaymentPrint> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine(request[0].companyCode,"Reports", "Data");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "PaymentReceipt.json";

            var fullPath = Path.Combine(pathToSave, fileName);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }
            System.IO.File.WriteAllText(fullPath, json);

            return Ok();
        }
    }
}