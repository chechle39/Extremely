using DevExpress.Compatibility.System.Web;
using DevExpress.XtraReports.UI;
using DevExpress.XtraReports.Web.ReportDesigner;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using XBOOK.Data.ViewModels;


namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportDesignerController : ControllerBase
    {
        [HttpPost("[action]/{reportUrl}")]
        public object GetReportDesignerModel(string reportUrl)
        {
            string modelJsonScript = new ReportDesignerClientSideModelGenerator(HttpContext.RequestServices).GetJsonModelScript(reportUrl, null, "/DXXRD", "/DXXRDV", "/DXXQB");
            return new JavaScriptSerializer().Deserialize<object>(modelJsonScript);
        }

        [HttpPost("[action]")]
        public IActionResult ReadNameReport ()
        {
            var itemss = new List<ReportNameViewModel>();
            var folderName = Path.Combine("Reports", "Data");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "NameReport.json";
            var fullPath = Path.Combine(pathToSave, fileName);
            using (StreamReader r = new StreamReader(fullPath))
            {
                var json = r.ReadToEnd();
                var items = JsonConvert.DeserializeObject<List<ReportNameViewModel>>(json);
                foreach (var item in items)
                {
                    itemss.Add(item);
                }                
            }
            return Ok(itemss);
        }

    }
}