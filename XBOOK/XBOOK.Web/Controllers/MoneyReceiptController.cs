using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoneyReceiptController : ControllerBase
    {
        private readonly IMoneyReceiptService _iMoneyReceiptService;
        private readonly IMoneyReceiptDapper _moneyReceiptDapper;
        public MoneyReceiptController(IMoneyReceiptService iMoneyReceiptService, IMoneyReceiptDapper moneyReceiptDapper)
        {
            _iMoneyReceiptService = iMoneyReceiptService;
            _moneyReceiptDapper = moneyReceiptDapper;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateMoneyReceipt(MoneyReceiptViewModel request)
        {
            var saveData = await _iMoneyReceiptService.CreateMoneyReceipt(request);
            return Ok(saveData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateMoneyReceipt(MoneyReceiptViewModel request)
        {
            var updateData = await _iMoneyReceiptService.Update(request);
            return Ok(updateData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteMoneyReceipt(List<requestDeleted> request)
        {
            var removeData = await _iMoneyReceiptService.DeletedMoneyReceipt(request);
            return Ok(removeData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetLastMoneyReceipt()
        {
            var data = await _iMoneyReceiptService.GetLastMoneyReceipt();
            return Ok(data);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllMoneyReceipt([FromBody]MoneyReceiptRequest request)
        {
            // var saleListInvoice = await _saleInvoiceService.GetAllSaleInvoice(request);
            var data = await _moneyReceiptDapper.GetMoneyReceipt(request);
            return Ok(data);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateMoneyReceiptPayMent(MoneyReceiptPayment request)
        {
            var saveData = await _iMoneyReceiptService.CreateMoneyReceiptPaymentAsync(request);
            return Ok(saveData);
        }
        [HttpPost("[action]")]
        public IActionResult SaveFileJson(MoneyReceiptViewModelPrint request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine("Reports", "Data");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "MoneyReceipt.json";

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