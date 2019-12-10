using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
    [Route("api/[controller]")]
    [ApiController]
    public class SaleInvoiceController : ControllerBase
    {
        ICompanyProfileService _iCompanyProfileService;
        ISaleInvoiceService _saleInvoiceService;
        private readonly IRepository<SaleInvoice> _saleInvoiceUowRepository;
        private readonly IUnitOfWork _uow;
        IInvoiceServiceDapper _invoiceServiceDapper;
        public SaleInvoiceController(ICompanyProfileService iCompanyProfileService, ISaleInvoiceService saleInvoiceService, IUnitOfWork uow, IInvoiceServiceDapper invoiceServiceDapper)
        {
            _saleInvoiceService = saleInvoiceService;
            _uow = uow;
            _saleInvoiceUowRepository = _uow.GetRepository<IRepository<SaleInvoice>>();
            _invoiceServiceDapper = invoiceServiceDapper;
            _iCompanyProfileService = iCompanyProfileService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllSaleInvoice([FromBody]SaleInvoiceListRequest request)
        {
            // var saleListInvoice = await _saleInvoiceService.GetAllSaleInvoice(request);
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
                    var imageFolder = $@"D:\uploaded\{prf.Result.companyName}";


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
            var imageFolder = $@"D:\uploaded\{prf.Result.companyName}";
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
            var imageFolder = $@"D:\uploaded\{prf.Result.companyName}";
            System.IO.File.Delete(imageFolder + "\\" + request.FileName);
            return Ok();
        }
    }
}