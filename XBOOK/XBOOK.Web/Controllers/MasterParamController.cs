﻿using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;
using System.Linq;
using System.Collections.Generic;
using XBOOK.Data.Model;

namespace XBOOK.Web.Controllers
{
    public class MasterParamController : BaseAPIController
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

        [HttpPost("[action]")]
        public async Task<IActionResult> GetMasTerByPaymentReceipt()
        {
            return Ok(await _iMasterParamService.GetMasTerByPaymentReceipt());
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetMasTerByMoneyReceipt()
        {
            return Ok(await _iMasterParamService.GetMasTerByMoneyReceipt());
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetMasTerByPaymentType()
        {
            return Ok(await _iMasterParamService.GetMasTerByPaymentType());
        }
    }
}