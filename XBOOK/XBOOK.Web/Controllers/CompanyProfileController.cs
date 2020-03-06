using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class CompanyProfileController : BaseAPIController
    {
        ICompanyProfileService _iCompanyProfileService;
        public CompanyProfileController(ICompanyProfileService iCompanyProfileService)
        {
            _iCompanyProfileService = iCompanyProfileService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllClientAsync()
        {
            var clientList = await _iCompanyProfileService. GetInFoProfile1();
            return Ok(clientList);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var getCkientById = await _iCompanyProfileService.GetCompanyById(id);
            return Ok(getCkientById);
        }


        [HttpPost("[action]")]
        public IActionResult SaveCompanyProfile(CompanyProfileViewModel rs)
        {
            _iCompanyProfileService.CreateCompanyProfile(rs);
            return Ok();
        }
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateCompanyProfile([FromBody]CompanyProfileViewModel request)
        {
            var update = await _iCompanyProfileService.UpdateCompanyProfile(request);
            return Ok();
        }

    }
}