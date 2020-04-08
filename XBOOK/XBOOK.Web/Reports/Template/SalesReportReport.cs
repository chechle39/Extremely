using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using XBOOK.Dapper.ViewModels;

namespace XBOOK.Web.Reports.Template
{
    public partial class SalesReportReport
    {
        public SalesReportReport()
        {
            InitializeComponent();
        }
        public class CreateReport
        {
            public List<SalesReportPrintViewodel> Data()
            {
                var itemss = new List<SalesReportPrintViewodel>();
                var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
                var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fileName = "SalesReport.json";
                var fullPath = Path.Combine(pathToSave, fileName);
                using (StreamReader r = new StreamReader(fullPath))
                {
                    var json = r.ReadToEnd();
                    var items = JsonConvert.DeserializeObject<List<SalesReportPrintViewodel>>(json);
                    foreach (var item in items)
                    {
                        itemss.Add(item);
                    }
                }
                return itemss;
            }

        }
    }

}
