using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.Policies;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using XBOOK.Web.Claims.System;

namespace XBOOK.Web.Controllers
{
    public class BuyInvoicesController : BaseAPIController
    {
        private readonly IBuyInvoiceServiceDapper _buyInvoiceServiceDapper;
        private readonly IBuyInvoiceService _buyInvoiceService;
        ICompanyProfileService _iCompanyProfileService;

        public BuyInvoicesController(IBuyInvoiceServiceDapper buyInvoiceServiceDapper, IBuyInvoiceService buyInvoiceService, ICompanyProfileService iCompanyProfileService)
        {
            _buyInvoiceServiceDapper = buyInvoiceServiceDapper;
            _buyInvoiceService = buyInvoiceService;
            _iCompanyProfileService = iCompanyProfileService;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> CreateBuyInvoice(BuyInvoiceModelRequest request)
        {
            var CreateData = await _buyInvoiceService.CreateBuyInvoice(request);
            return Ok(CreateData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllBuyInvoice([FromBody]SaleInvoiceListRequest request)
        {
            var buyListInvoice = await _buyInvoiceServiceDapper.GetBuyInvoice(request);
            return Ok(buyListInvoice);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteBuyInv(List<Deleted> deleted)
        {
            await _buyInvoiceService.DeleteBuyInvoice(deleted);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetDF()
        {
            var saleListInvoice = await _buyInvoiceService.GetALlDF();
            return Ok(saleListInvoice);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetLastIndexBuyInvoiceAsync()
        {
            var buyListInvoice = await _buyInvoiceService.GetLastBuyInvoice();
            return Ok(buyListInvoice);
        }

        [HttpPut("[action]")]
        public async Task<ActionResult> UpdateBuyInvoice(BuyInvoiceViewModel request)
        {
            await _buyInvoiceService.Update(request);
            return Ok(request);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetBuyInvoiceById(long id)
        {
            var buyListInvoice = await _buyInvoiceService.GetBuyInvoiceById(id);
            return Ok(buyListInvoice);
        }

        [HttpPost("[action]"), DisableRequestSizeLimit]
        [AuthorizationClaimCustom(Authority.ROLE_EDIT)]
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
                    var imageFolder = $@"C:\uploaded\{prf.Result.code}\Supplier";


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
            var imageFolder = $@"C:\uploaded\{prf.Result.code}\Supplier";
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
            var imageFolder = $@"C:\uploaded\{prf.Result.code}\Supplier";
            System.IO.File.Delete(imageFolder + "\\" + request.FileName);
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult Download(ResponseFileName request)
        {
            if (request.FileName == null)
                return Content("filename not present");

            try
            {
                var prf = _iCompanyProfileService.GetInFoProfile();
                var imageFolder = $@"C:\uploaded\{prf.Result.code}\Supplier";
                if (!Directory.Exists(imageFolder))
                {
                    Directory.CreateDirectory(imageFolder);
                }
                var path = Path.Combine(imageFolder, request.FileName);
                var fileExists = System.IO.File.Exists(path);
                var fs = System.IO.File.OpenRead(path);
                return File(fs, GetContentType(path), request.FileName);
            }
            catch (Exception ex)
            {

            }
            return Ok();


        }
        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
}