using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        IProductService _iProductService;
        private readonly XBookContext _context;
        public ProductController(IProductService iProductService, XBookContext context, IHttpContextAccessor httpContextAccessor)
        {
            _iProductService = iProductService;
            _context = context;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllProductAsync(ProductSerchRequest request)
        {
            var clientprd = await _iProductService.GetAllProduct(request);
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
        public async Task<IActionResult> UpdateProduct([FromBody]ProductViewModel request)
        {
            await  _iProductService.Update(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult DeleteProduct([FromBody]List<requestDeleted> request)
        {
            var sttDelProduct = _iProductService.DeleteProduct(request);
            return Ok(sttDelProduct);
        }
    }
}