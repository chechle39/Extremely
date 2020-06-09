using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using System.Linq;
using System.Collections.Generic;
using XBOOK.Data.Model;
using XBOOK.Common.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Http;

namespace XBOOK.Web.Controllers
{
    public class MasterParamController : BaseAPIController
    {
        IMasterParamService _iMasterParamService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IMemoryCache _cache;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterParamController(IMasterParamService iMasterParamService, IAuthorizationService authorizationService, IMemoryCache cache, IHttpContextAccessor httpContextAccessor)
        {
            _iMasterParamService = iMasterParamService;
            _authorizationService = authorizationService;
            _cache = cache;
            _httpContextAccessor = httpContextAccessor;
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
            List<MasterParamViewModel> master ;
            var code  = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            if (_cache.TryGetValue(CacheKey.Masterparam.MasTerByPaymentReceipt + code, out List<MasterParamViewModel> cacheData))
            {
                master = cacheData;
            } else
            {
                master = (List<MasterParamViewModel>)await _iMasterParamService.GetMasTerByPaymentReceipt();
                _cache.Set(CacheKey.Masterparam.MasTerByPaymentReceipt + code, master);
            }
            return Ok(master);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetMasTerByMoneyReceipt()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            List<MasterParamViewModel> master;
            var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            if (_cache.TryGetValue(CacheKey.Masterparam.MasTerByMoneyReceipt + code, out List<MasterParamViewModel> cacheData))
            {
                master = cacheData;
            }
            else
            {
                master = (List<MasterParamViewModel>)await _iMasterParamService.GetMasTerByMoneyReceipt();
                _cache.Set(CacheKey.Masterparam.MasTerByMoneyReceipt + code, master);
            }

            return Ok(master);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetMasTerByPaymentType()
        {
            var result = await _authorizationService.AuthorizeAsync(User, "Master Param", Operations.Read);
            if (!result.Succeeded)
                return Unauthorized();
            List<MasterParamViewModel> master;
            var code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            if (_cache.TryGetValue(CacheKey.Masterparam.PaymentType + code, out List<MasterParamViewModel> cacheData))
            {
                master = cacheData;
            }
            else
            {
                master = (List<MasterParamViewModel>)await _iMasterParamService.GetMasTerByPaymentType();
                _cache.Set(CacheKey.Masterparam.PaymentType + code, master);
            }
            return Ok(master);
        }
    }
}