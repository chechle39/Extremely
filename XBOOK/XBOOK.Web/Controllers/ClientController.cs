using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        IClientService _iClientService;
        public ClientController(IClientService iClientService)
        {
            _iClientService = iClientService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllClientAsync([FromBody]ClientSerchRequest request)
        {
            var clientList = await _iClientService.GetAllClient(request);
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

        [HttpPost("[action]/{id}")]
        public  IActionResult DeleteClient(long id)
        {
             _iClientService.DeletedClient(id);
            return Ok();
        }
    }
}