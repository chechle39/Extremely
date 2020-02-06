using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

    [Route("api/[controller]")]
    [ApiController]
    public class AccountChartController : ControllerBase
    {
        IAcountChartService _iAccountService;
        public AccountChartController(IAcountChartService iAccountService)
        {
            _iAccountService = iAccountService;
        }
    [HttpPost("[action]")]
    public async Task<IActionResult> GetAllAccount()
    {
        var clientprd = await _iAccountService.GetAllAccount();
        return Ok(clientprd);
    }
    [HttpPost("[action]")]
    public async Task<IActionResult> GetAllTreeAccount()
    {
        var tree = await _iAccountService.GetAllTreeAccountAsync();
        var x = tree;
        return Ok(x);
    }
}
