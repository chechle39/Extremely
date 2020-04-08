using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Web.Controllers
{
    public class DashboardController : BaseAPIController
    {
        IDashboardServiceDapper _iDashboardServiceDapper;
        public DashboardController(IDashboardServiceDapper iDashboardServiceDapper)
        {
            _iDashboardServiceDapper = iDashboardServiceDapper;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllChartAsync()
        {
            AllChartViewModel response = new AllChartViewModel();
            DashboardRequest request = new DashboardRequest() { interval = "month" };
            response.chart1 = _iDashboardServiceDapper.getSaleChartDataAsync(request).Result;
            response.chart2 = _iDashboardServiceDapper.getPurchaseChartDataAsync(request).Result;
            response.chart3 = _iDashboardServiceDapper.getBalanceChartDataAsync(request).Result;
            response.chart4 = _iDashboardServiceDapper.getSaleInvoiceReportAsync(request).Result;
            return Ok(await Task.FromResult(response));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetBalanceChartDataAsync([FromBody]DashboardRequest request)
        {
            return Ok(await _iDashboardServiceDapper.getBalanceChartDataAsync(request));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetSaleChartDataAsync([FromBody]DashboardRequest request)
        {
            return Ok( await _iDashboardServiceDapper.getSaleChartDataAsync(request));
        }

       [HttpPost("[action]")]
        public async Task<IActionResult> GetPurchaseChartDataAsync([FromBody]DashboardRequest request)
        {
            return Ok(await _iDashboardServiceDapper.getPurchaseChartDataAsync(request));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> getSaleInvoiceReportAsync([FromBody]DashboardRequest request)
        {
            return Ok(await _iDashboardServiceDapper.getSaleInvoiceReportAsync(request));
        }
    }
}