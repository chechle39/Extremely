using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaxController : ControllerBase
    {
        ITaxService _iTaxService;
        public TaxController(ITaxService iTaxService)
        {
            _iTaxService = iTaxService;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllTax()
        {
            var taxList = await _iTaxService.GetAllTax();
            return Ok(taxList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateTax([FromBody]TaxViewModel request)
        {
             await _iTaxService.CreateTax(request);
            return Ok(request);
        }
    }
}