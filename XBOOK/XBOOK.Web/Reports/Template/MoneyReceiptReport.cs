using System;
using System.Collections.Generic;
using System.IO;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
using XBOOK.Data.ViewModels;

namespace XBOOK.Web.Reports.Template
{
    public partial class MoneyReceiptReport
    {
        public MoneyReceiptReport()
        {
            InitializeComponent();
        }

        private void label29_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {

        }
    }
    public class CreateReport
    {
        public MoneyReceiptViewModelPrint Data()
        {
            var itemss = new MoneyReceiptViewModelPrint();
            var folderName = Path.Combine("Reports", "Data");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "MoneyReceipt.json";
            var fullPath = Path.Combine(pathToSave, fileName);
            using (StreamReader r = new StreamReader(fullPath))
            {
                var json = r.ReadToEnd();
                var items = JsonConvert.DeserializeObject<MoneyReceiptViewModelPrint>(json);
                return items;
            }

        }

    }
}
