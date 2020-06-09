using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using DevExpress.XtraReports.UI;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Service;

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
            var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
            var itemss = new MoneyReceiptViewModelPrint();
            var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
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

        //public string GetCode()
        //{
        //    var folderName = Path.Combine("Reports", "Company");
        //    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
        //    var fileName = "CompanyExist.json";
        //    var fullPath = Path.Combine(pathToSave, fileName);
        //    using (StreamReader r = new StreamReader(fullPath))
        //    {
        //        var json = r.ReadToEnd();
        //        System.IO.File.Delete(fullPath);
        //        return json;
        //    }
        //}
    }
}
