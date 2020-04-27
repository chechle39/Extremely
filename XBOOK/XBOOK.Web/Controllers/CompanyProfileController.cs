using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class CompanyProfileController : BaseAPIController
    {
        ICompanyProfileService _iCompanyProfileService;
        private readonly IAuthorizationService _authorizationService;
        public CompanyProfileController(ICompanyProfileService iCompanyProfileService, IAuthorizationService authorizationService)
        {
            _iCompanyProfileService = iCompanyProfileService;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllClientAsync()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Company profile", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var clientList = await _iCompanyProfileService. GetInFoProfile1();
            return Ok(clientList);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Company profile", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var getCkientById = await _iCompanyProfileService.GetCompanyById(id);
            return Ok(getCkientById);
        }


        [HttpPost("[action]")]
        public IActionResult SaveCompanyProfile(CompanyProfileViewModel rs)
        {
            var result =  _authorizationService.AuthorizeAsync(User, "Company profile", Operations.Create);
            if (!result.Result.Succeeded)
                return Unauthorized();
            _iCompanyProfileService.CreateCompanyProfile(rs);
            return Ok();
        }
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateCompanyProfile([FromBody]CompanyProfileViewModel request)
        {
            var result = _authorizationService.AuthorizeAsync(User, "Company profile", Operations.Update);
            if (!result.Result.Succeeded)
                return Unauthorized();
            var update = await _iCompanyProfileService.UpdateCompanyProfile(request);
            return Ok();
        }

    }
}