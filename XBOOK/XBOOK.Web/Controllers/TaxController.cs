using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using System.Linq;
using System.Collections.Generic;
using XBOOK.Data.Model;

namespace XBOOK.Web.Controllers
{
    public class TaxController : BaseAPIController
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
            var sort = taxList.OrderBy(x => x.TaxRate);
            return Ok(sort);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateTax([FromBody]List<TaxViewModel> request)
        {
             await _iTaxService.CreateTax(request);
            return Ok(request);
        }

        [HttpPost("[action]")]
        public  IActionResult DeleteTax([FromBody]List<requestDeleted> request)
        {
             _iTaxService.DeleteTax(request);
            return Ok(request);
        }
    }
}