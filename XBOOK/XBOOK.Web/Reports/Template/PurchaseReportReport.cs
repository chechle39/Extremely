using System;
using System.Collections.Generic;
using System.IO;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
using XBOOK.Dapper.ViewModels;

namespace XBOOK.Web.Reports.Template
{
    public partial class PurchaseReportReport
    {
        public PurchaseReportReport()
        {
            InitializeComponent();
        }
        public class CreateReport
        {
            public List<PurchaseReportPrintViewodel> Data()
            {
                var itemss = new List<PurchaseReportPrintViewodel>();
                var folderName = Path.Combine("Reports", "Data");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fileName = "PurchaseReport.json";
                var fullPath = Path.Combine(pathToSave, fileName);
                using (StreamReader r = new StreamReader(fullPath))
                {
                    var json = r.ReadToEnd();
                    var items = JsonConvert.DeserializeObject<List<PurchaseReportPrintViewodel>>(json);
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