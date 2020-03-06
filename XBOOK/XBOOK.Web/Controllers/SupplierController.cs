using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class SupplierController : BaseAPIController
    {
        private readonly ISupplierService _supplierService;
        ISupplierServiceDapper _supplierServiceDapper;

        public SupplierController(ISupplierService supplierService, ISupplierServiceDapper supplierServiceDapper)
        {
            _supplierService = supplierService;
            _supplierServiceDapper = supplierServiceDapper;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllSupplierAsync([FromBody]ClientSerchRequest request)
        {
            var supplier = await _supplierService.GetAllSupplier(request);
            return Ok(supplier);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllSupplierDapper([FromBody]ClientSerchRequest request)
        {
            var clientList = await _supplierServiceDapper.GetSupplierAsync(request);
            return Ok(clientList);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetSupplierById(int id)
        {
            var getCkientById = await _supplierService.GetSupplierById(id);
            return Ok(getCkientById);
        }
        [HttpPost("[action]")]
        public IActionResult SaveSupplier(SupplierCreateRequest rs)
        {
            _supplierService.CreateSupplier(rs);
            return Ok();
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateSupplier([FromBody]SupplierCreateRequest request)
        {
            var update = await _supplierService.UpdateSupplier(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteClient(List<requestDeleted> request)
        {
            await _supplierService.DeletedSupplier(request);
            return Ok();
        }
        [HttpPost("[action]")]
        public IActionResult ExportSupplier([FromBody]List<SupplierCreateRequest> request)
        {
            Encoding latinEncoding = Encoding.GetEncoding("UTF-8");
            var data = _supplierService.GetDataSupplierAsync(request);
            return File(data, "application/csv", $"latinEncoding.csv");
        }
        [HttpPost("[action]")]
        public IActionResult CreateImportSupplier(List<SupplierCreateRequest> rs)
        {
            _supplierService.CreateSupplierImport(rs);
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult ImportExcel(List<IFormFile> request)
        {
            var folderName = Path.Combine("Reports", "Data");
            var filename = ContentDispositionHeaderValue
                                     .Parse(Request.Form.Files[0].ContentDisposition)
                                     .FileName
                                     .Trim('"');
            var fullPath = Path.Combine(folderName, filename);
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else if (filename.EndsWith(".csv"))
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

                    if (!Directory.Exists(folderName))
                    {
                        Directory.CreateDirectory(folderName);
                    }
                    string filePath = Path.Combine(folderName, name + filename);
                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        file.CopyTo(fs);
                        fs.Flush();
                    }
                }
            }
            if (filename.EndsWith(".csv"))
            {
                using (StreamReader r = new StreamReader(fullPath))
                {
                    var json = r.ReadToEnd();
                    //    var items = JsonConvert.DeserializeObject<List<String[]>>(json);
                    var data = (from row in json.Split('\r')
                                select row.Split(',')).ToList();
                    //   string jsonString = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(data);
                    return Ok(data);
                }
            }
            else
            {
                return new BadRequestObjectResult(files);
            }

            return Ok();

        }
    }
}