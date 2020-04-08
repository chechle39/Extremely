using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class MoneyReceiptController : BaseAPIController
    {
        private readonly IMoneyReceiptService _iMoneyReceiptService;
        private readonly IMoneyReceiptDapper _moneyReceiptDapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MoneyReceiptController(IMoneyReceiptService iMoneyReceiptService, IMoneyReceiptDapper moneyReceiptDapper, IHttpContextAccessor httpContextAccessor)
        {
            _iMoneyReceiptService = iMoneyReceiptService;
            _moneyReceiptDapper = moneyReceiptDapper;
            _httpContextAccessor = httpContextAccessor;
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
            var savejs = XBOOK.Web.Helpers.GetCompanyCode.SaveDataJson(_httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value);
            string json = JsonConvert.SerializeObject(request);
            var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
            var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
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

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetMoneyReceiptById(long id)
        {
            return Ok(await _iMoneyReceiptService.GetMoneyByIdObject(id));
        }

    }
}