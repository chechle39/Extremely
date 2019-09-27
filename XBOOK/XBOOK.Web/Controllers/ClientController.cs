using Microsoft.AspNetCore.Mvc;
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

        [HttpPost]
        public async Task<IActionResult> GetAllClientAsync()
        {
            var clientList = await _iClientService.GetAllClient();
            return Ok(clientList);
        }
    }
}