using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DevExpress.XtraReports.Web.ReportDesigner;

namespace XBOOK.Web.Controllers
{
    public class TestController : Controller
    {
        public IActionResult Index()
        {
            
            return View();
        }
    }
}
