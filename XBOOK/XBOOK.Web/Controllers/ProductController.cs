using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class ProductController : BaseAPIController
    {
        IProductService _iProductService;
        private readonly XBookContext _context;
        public ProductController(IProductService iProductService, XBookContext context, IHttpContextAccessor httpContextAccessor)
        {
            _iProductService = iProductService;
            _context = context;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllProductAsync(ProductSerchRequest request)
        {
            var clientprd = await _iProductService.GetAllProduct(request);
            return Ok(clientprd);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetProductById([FromBody]int id)
        {
            var getProductById = await _iProductService.GetProductById(id);
            return Ok(getProductById);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateProduct(ProductViewModel request)
        {
            await _iProductService.CreateProduct(request);
            return Ok(request);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateProduct([FromBody]ProductViewModel request)
        {
            await _iProductService.Update(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult DeleteProduct([FromBody]List<requestDeleted> request)
        {
            var sttDelProduct = _iProductService.DeleteProduct(request);
            return Ok(sttDelProduct);
        }
        [HttpPost("[action]")]
        public IActionResult ExportProduct([FromBody]List<ProductViewModel> request)
        {
            Encoding latinEncoding = Encoding.GetEncoding("UTF-8");
            var data = _iProductService.GetDataProductAsync(request);
            return File(data, "application/csv", $"latinEncoding.csv");
        }

        [HttpPost("[action]")]
        public IActionResult CreateImportProduct(List<ProductViewModel> rs)
        {
            _iProductService.CreateProductImport(rs);
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