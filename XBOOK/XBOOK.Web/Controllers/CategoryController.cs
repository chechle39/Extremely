using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        ICategoryService _iCategoryService;
        public CategoryController(ICategoryService iCategoryService)
        {
            _iCategoryService = iCategoryService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllCategory()
        {
            var categoryList = await _iCategoryService.GetAllCategory();
            return Ok(categoryList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetCategoryById([FromBody]int id)
        {
            var getCategoryById = await _iCategoryService.GetCategoryById(id);
            return Ok(getCategoryById);
        }
    }
}