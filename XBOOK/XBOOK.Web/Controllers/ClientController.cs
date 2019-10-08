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

        [HttpPost("[action]")]
        public async Task<IActionResult> GetClientById([FromBody]int id)
        {
            var getCkientById = await _iClientService.GetClientById(id);
            return Ok(getCkientById);
        }
    }
}