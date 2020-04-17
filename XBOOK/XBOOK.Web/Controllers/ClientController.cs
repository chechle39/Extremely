using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Common.Exceptions;
using XBOOK.Common.Helpers;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class ClientController : BaseAPIController
    {
        IClientService _iClientService;
        IClientServiceDapper _iClientServiceDapper;
        private readonly IAuthorizationService _authorizationService;
        public ClientController(IClientService iClientService, IClientServiceDapper iClientServiceDapper, IAuthorizationService authorizationService)
        {
            _iClientService = iClientService;
            _iClientServiceDapper = iClientServiceDapper;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllClientAsync([FromBody]ClientSerchRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Clients", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var clientList = await _iClientService.GetAllClient(request);
            return Ok(clientList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllClientDapper([FromBody]ClientSerchRequest request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Clients", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var clientList = await _iClientServiceDapper.GetClientAsync(request);
            return Ok(clientList);
        }


        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetClientById(int id)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Clients", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var getCkientById = await _iClientService.GetClientById(id);
            return Ok(getCkientById);
        }
        [HttpPost("[action]")]
        public  IActionResult SaveClient(ClientCreateRequet rs)
        {
            var result = _authorizationService.AuthorizeAsync(User, "Clients", Operations.Create);
            if (!result.Result.Succeeded)
                return Unauthorized();
            var client =  _iClientService.CreateClient(rs);
            if (client == false)
            {
                return Ok(new GenericResult(true, "insert false"));
            }
            return Ok();
           
        }
        [HttpPost("[action]")]
        public IActionResult CreateImportClient(List<ClientCreateRequet> rs)
        {
            var result =  _authorizationService.AuthorizeAsync(User, "Clients", Operations.Create);
            if (!result.Result.Succeeded)
                return Unauthorized();
            _iClientService.CreateClientImport(rs);
            return Ok();
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateClient([FromBody]ClientCreateRequet request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Clients", Operations.Update);
            if (!result.Succeeded)
                return Unauthorized();
            var update = await _iClientService.UpdateClient(request);
            if (update == false)
            {
                return Ok(new GenericResult(true, "insert false"));
            }
            return Ok();    
        }

        [HttpPost("[action]")]
        public IActionResult DeleteClient(List<requestDeleted> request)
        {
            var result =  _authorizationService.AuthorizeAsync(User, "Clients", Operations.Delete);
            if (!result.Result.Succeeded)
                return Unauthorized();
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
                
                using (StreamReader reader = new StreamReader(fullPath))
                {
                    var json = reader.ReadToEnd();
                    var data = (from row in json.Split('\r')
                                select row.Split(',')).ToList();

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
            var data = _iClientService.GetDataClientAsync(request);

            Encoding latinEncoding = Encoding.GetEncoding("utf-8");
            return File(data, "text/csv;charset=utf-8");
        }


    }

}


                