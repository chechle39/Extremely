using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class CategoryController : BaseAPIController
    {
        ICategoryService _iCategoryService;
        private readonly IAuthorizationService _authorizationService;
        public CategoryController(ICategoryService iCategoryService, IAuthorizationService authorizationService)
        {
            _iCategoryService = iCategoryService;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllCategory()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Products", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var categoryList = await _iCategoryService.GetAllCategory();
            return Ok(categoryList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetCategoryById([FromBody]int id)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Products", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var getCategoryById = await _iCategoryService.GetCategoryById(id);
            return Ok(getCategoryById);
        }
    }
}