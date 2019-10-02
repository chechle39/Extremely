using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        IProductService _iProductService;
        public ProductController(IProductService iProductService)
        {
            _iProductService = iProductService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllClientAsync()
        {
            var clientprd = await _iProductService.GetAllProduct();
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
        public async Task<IActionResult> UpdateProduct(ProductViewModel request)
        {
            await  _iProductService.Update(request);
            return Ok(request);
        }
    }
}