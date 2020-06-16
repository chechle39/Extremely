using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
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
        ICompanyProfileService _iCompanyProfileService;
        public TaxBuySaleInvoiceController(
            ICompanyProfileService iCompanyProfileService,
            ITaxBuySaleInvoiceService taxBuySaleInvoiceService,
            IUnitOfWork uow,
            ITaxBuyInvoiceServiceDapper taxBuyInvoiceServiceDapper,
            IAuthorizationService authorizationService)
        {
            _taxBuySaleInvoiceService = taxBuySaleInvoiceService;
            _taxBuyInvoiceServiceDapper = taxBuyInvoiceServiceDapper;
            _authorizationService = authorizationService;
            _iCompanyProfileService = iCompanyProfileService;
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
        public ActionResult CreateTaxBuySaleInvoice(TaxBuyInvoiceModelRequest request)
        {
            var result = _authorizationService.AuthorizeAsync(User, "Invoice", Operations.Create);
            if (!result.Result.Succeeded)
                return Unauthorized();
            var CreateData = _taxBuySaleInvoiceService.CreateTaxInvoice(request);
            return Ok(CreateData);
        }


        [HttpPut("[action]")]
        public ActionResult UpdateTaxBuyInvoice(TaxBuyInvoiceModelRequest request)
        {
            var result = _authorizationService.AuthorizeAsync(User, "Invoice", Operations.Update);
            if (!result.Result.Succeeded)
                return Unauthorized();
            _taxBuySaleInvoiceService.UpdateTaxInvoice(request);
            return Ok(request);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetTaxBuyInvoiceById(long id)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Invoice", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var taxSaleListInvoice = await _taxBuySaleInvoiceService.GetTaxBuyInvoiceById(id);
            return Ok(taxSaleListInvoice);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteTaxBuyInv(List<requestDeleted> deleted)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Invoice", Operations.Delete);
            if (!result.Succeeded)
                return Unauthorized();
            await _taxBuySaleInvoiceService.DeletedTaxSaleInv(deleted);
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult GetDF()
        {
            var saleListInvoice = _taxBuySaleInvoiceService.GetALlDF();
            return Ok(saleListInvoice);
        }

        [HttpPost("[action]")]
        public IActionResult GetLastIndexTaxBuyInvoiceAsync()
        {
            var saleListInvoice = _taxBuySaleInvoiceService.GetLastInvoice();
            return Ok(saleListInvoice);
        }

        [HttpPost("[action]"), DisableRequestSizeLimit]
        public IActionResult Upload(List<IFormFile> request)
        {
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                string name = "";
                foreach (var item1 in Request.Form)
                {
                    name = item1.Value.ToString();
                }
                foreach (var item in Request.Form.Files)
                {
                    // var x = item;
                    var file = item;
                    var filename = ContentDispositionHeaderValue
                                        .Parse(file.ContentDisposition)
                                        .FileName
                                        .Trim('"');
                    var prf = _iCompanyProfileService.GetInFoProfile();
                    var imageFolder = $@"C:\inetpub\wwwroot\XBOOK_FILE\{prf.Result.code}\TaxBuyInvoice";


                    if (!Directory.Exists(imageFolder))
                    {
                        Directory.CreateDirectory(imageFolder);
                    }
                    string filePath = Path.Combine(imageFolder, name + "_" + filename);
                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        file.CopyTo(fs);
                        fs.Flush();
                    }
                }
                return Ok();
            }
        }

        [HttpPost("[action]")]
        public IActionResult GetFile(requestGetFile request)
        {
            var prf = _iCompanyProfileService.GetInFoProfile();
            var imageFolder = $@"C:\inetpub\wwwroot\XBOOK_FILE\{prf.Result.code}\TaxBuyInvoice";
            if (!Directory.Exists(imageFolder))
            {
                return Ok();
            }
            string[] files = Directory.GetFiles(imageFolder);
            var listFile = new List<ResponseFileName>();
            for (int i = 0; i < files.Length; i++)
            {
                var fileName = Path.GetFileName(files[i]);
                var isCheck = fileName.Split("_");
                if (request.Invoice + request.Seri == isCheck[0] + isCheck[1])
                {
                    byte[] imageArray = System.IO.File.ReadAllBytes(files[i]);
                    string base64ImageRepresentation = Convert.ToBase64String(imageArray);

                    listFile.Add(new ResponseFileName()
                    {
                        FileName = fileName
                    });
                }
            }

            return Ok(listFile);
        }

        [HttpPost("[action]")]
        public IActionResult RemoveFile(ResponseFileName request)
        {
            var prf = _iCompanyProfileService.GetInFoProfile();
            var imageFolder = $@"C:\inetpub\wwwroot\XBOOK_FILE\{prf.Result.code}\TaxBuyInvoice";
            System.IO.File.Delete(imageFolder + "\\" + request.FileName);
            return Ok();
        }
    }
}