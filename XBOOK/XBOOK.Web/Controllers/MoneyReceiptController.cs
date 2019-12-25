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
    }
}