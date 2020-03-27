using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class SaleInvoiceController : BaseAPIController
    {
        ICompanyProfileService _iCompanyProfileService;
        ISaleInvoiceService _saleInvoiceService;
        private readonly IRepository<SaleInvoice> _saleInvoiceUowRepository;
        private readonly IUnitOfWork _uow;
        IInvoiceServiceDapper _invoiceServiceDapper;
        public SaleInvoiceController(IHttpContextAccessor httpContextAccessor, ICompanyProfileService iCompanyProfileService, ISaleInvoiceService saleInvoiceService, IUnitOfWork uow, IInvoiceServiceDapper invoiceServiceDapper)
        {
            _saleInvoiceService = saleInvoiceService;
            _uow = uow;
            _saleInvoiceUowRepository = _uow.GetRepository<IRepository<SaleInvoice>>();
            _invoiceServiceDapper = invoiceServiceDapper;
            _iCompanyProfileService = iCompanyProfileService;
        }

        [HttpPost("[action]")]
      //  [AuthorizationClaimCustom(Authority.ROLE_VIEW)]
        public async Task<IActionResult> GetAllSaleInvoice([FromBody]SaleInvoiceListRequest request)
        {
            var saleListInvoice = await _invoiceServiceDapper.GetInvoiceAsync(request);
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
            var CreateData = _saleInvoiceService.CreateSaleInvoice(request);
            return Ok(CreateData);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetSaleInvoiceById(long id)
        {
            var saleListInvoice = await _saleInvoiceService.GetSaleInvoiceById(id);
            return Ok(saleListInvoice);
        }

        [HttpPost("[action]")]
        public async  Task<IActionResult> DeleteSaleInv (List<requestDeleted> deleted)
        {
             await _saleInvoiceService.DeletedSaleInv(deleted);
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
                foreach(var item1 in Request.Form)
                {
                    name = item1.Value.ToString();
                }
                foreach(var item in Request.Form.Files)
                {
                   // var x = item;
                    var file = item;
                    var filename = ContentDispositionHeaderValue
                                        .Parse(file.ContentDisposition)
                                        .FileName
                                        .Trim('"');
                    var prf = _iCompanyProfileService.GetInFoProfile();
                    var imageFolder = $@"C:\uploaded\{prf.Result.code}";


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
            var imageFolder = $@"C:\uploaded\{prf.Result.code}";
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
            var imageFolder = $@"C:\uploaded\{prf.Result.code}";
            System.IO.File.Delete(imageFolder + "\\" + request.FileName);
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<SaleInvoicePrintModel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine( "Reports", "Data");          
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "InvoiceReport.json";
         
            var fullPath = Path.Combine(pathToSave, fileName);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }
            System.IO.File.WriteAllText(fullPath, json);

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
                var imageFolder = $@"C:\uploaded\{prf.Result.code}";
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