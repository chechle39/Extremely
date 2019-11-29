using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
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

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateClient([FromBody]ClientCreateRequet request)
        {
            var update = await _iClientService.UpdateClient(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public  IActionResult DeleteClient(List<requestDeleted> request)
        {
             _iClientService.DeletedClient(request);
            return Ok();
        }
    }
}