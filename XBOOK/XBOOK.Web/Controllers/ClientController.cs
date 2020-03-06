using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class ClientController : BaseAPIController
    {
        IClientService _iClientService;
        IClientServiceDapper _iClientServiceDapper;
        public ClientController(IClientService iClientService, IClientServiceDapper iClientServiceDapper)
        {
            _iClientService = iClientService;
            _iClientServiceDapper = iClientServiceDapper;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllClientAsync([FromBody]ClientSerchRequest request)
        {
            var clientList = await _iClientService.GetAllClient(request);
            return Ok(clientList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllClientDapper([FromBody]ClientSerchRequest request)
        {
            var clientList = await _iClientServiceDapper.GetClientAsync(request);
            return Ok(clientList);
        }


        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetClientById(int id)
        {
            var getCkientById = await _iClientService.GetClientById(id);
            return Ok(getCkientById);
        }
        [HttpPost("[action]")]
        public IActionResult SaveClient(ClientCreateRequet rs)
        {
            _iClientService.CreateClient(rs);
            return Ok();
        }
        [HttpPost("[action]")]
        public IActionResult CreateImportClient(List<ClientCreateRequet> rs)
        {
            _iClientService.CreateClientImport(rs);
            return Ok();
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateClient([FromBody]ClientCreateRequet request)
        {
            var update = await _iClientService.UpdateClient(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult DeleteClient(List<requestDeleted> request)
        {
            _iClientService.DeletedClient(request);
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

        [HttpPost("[action]")]
        public IActionResult ExportClient([FromBody]List<ClientCreateRequet> request)
        {
            Encoding latinEncoding = Encoding.GetEncoding("UTF-8");
            var data = _iClientService.GetDataClientAsync(request);
            return File(data, "application/csv", $"latinEncoding.csv");
        }

    
    }

}


                