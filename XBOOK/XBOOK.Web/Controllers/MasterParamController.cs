using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using System.Linq;
using System.Collections.Generic;
using XBOOK.Data.Model;
using XBOOK.Common.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace XBOOK.Web.Controllers
{
    public class MasterParamController : BaseAPIController
    {
        IMasterParamService _iMasterParamService;
        private readonly IAuthorizationService _authorizationService;
        public MasterParamController(IMasterParamService iMasterParamService, IAuthorizationService authorizationService)
        {
            _iMasterParamService = iMasterParamService;
            _authorizationService = authorizationService;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllMaster()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            var taxList = await _iMasterParamService.GetAllMaster();
            return Ok(taxList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateMasterParam([FromBody]List<MasterParamViewModel> request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Create);
            if (!result.Succeeded)
                return Unauthorized();
            await _iMasterParamService.CreateMasterParam(request);
            return Ok(request);
        }
        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetMasterById(string id)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Create);
            if (!result.Succeeded)
                return Unauthorized();
            var getCkientById = await _iMasterParamService.GetMasterById(id);
            return Ok(getCkientById);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteMaster([FromBody] List<requestDeletedMaster> request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Delete);
            if (!result.Succeeded)
                return Unauthorized();
            _iMasterParamService.DeleteMaster(request);
            return Ok(request);
        }
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateMaster([FromBody]List<MasterParamViewModel> request)
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Update);
            if (!result.Succeeded)
                return Unauthorized();
            await _iMasterParamService.UpdateMaster(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetMasTerByPaymentReceipt()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            return Ok(await _iMasterParamService.GetMasTerByPaymentReceipt());
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetMasTerByMoneyReceipt()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            return Ok(await _iMasterParamService.GetMasTerByMoneyReceipt());
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetMasTerByPaymentType()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            return Ok(await _iMasterParamService.GetMasTerByPaymentType());
        }
    }
}