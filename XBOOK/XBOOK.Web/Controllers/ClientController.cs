using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
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
        public async Task<IActionResult> GetAllClientAsync()
        {
            var clientList = await _iClientService.GetAllClient();
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