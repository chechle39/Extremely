using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class SalesReportController : BaseAPIController
    {

        ISalesReportServiceDapper _iSalesReportServiceDapper;
        public SalesReportController(ISalesReportServiceDapper iSalesReportServiceDapper)
        {

            _iSalesReportServiceDapper = iSalesReportServiceDapper;
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> GetALLDebitageServiceDapper([FromBody]SalesReportModelSearchRequest request)
        {
            var DebitAgeList = await _iSalesReportServiceDapper.GetISalesReportServiceDapperAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetDatareportServiceDapper([FromBody]SalesReportModelSearchRequest request)
        {
            var DebitAgeList = await _iSalesReportServiceDapper.GetISalesDataReportServiceDapperAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<SalesReportPrintViewodel> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine("Reports", "Data");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "SalesReport.json";

            var fullPath = Path.Combine(pathToSave, fileName);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }
            System.IO.File.WriteAllText(fullPath, json);

            return Ok();
        }
    }
}