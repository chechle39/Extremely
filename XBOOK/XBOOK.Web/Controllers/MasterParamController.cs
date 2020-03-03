using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using System.Linq;
using System.Collections.Generic;
using XBOOK.Data.Model;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MasterParamController : ControllerBase
    {
        IMasterParamService _iMasterParamService;
        public MasterParamController(IMasterParamService iMasterParamService)
        {
            _iMasterParamService = iMasterParamService;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllMaster()
        {
            var taxList = await _iMasterParamService.GetAllMaster();
            return Ok(taxList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateMasterParam([FromBody]List<MasterParamViewModel> request)
        {
             await _iMasterParamService.CreateMasterParam(request);
            return Ok(request);
        }
        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetMasterById(string id)
        {
            var getCkientById = await _iMasterParamService.GetMasterById(id);
            return Ok(getCkientById);
        }
        [HttpPost("[action]")]
        public IActionResult DeleteMaster([FromBody] List<requestDeletedMaster> request)
        {
            _iMasterParamService.DeleteMaster(request);
            return Ok(request);
        }
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateMaster([FromBody]List<MasterParamViewModel> request)
        {
            await _iMasterParamService.UpdateMaster(request);
            return Ok();
        }
    }
}