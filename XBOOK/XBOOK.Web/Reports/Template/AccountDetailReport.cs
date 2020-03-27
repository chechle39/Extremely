using System;
using System.Collections.Generic;
using System.IO;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
using XBOOK.Data.Model;

namespace XBOOK.Web.Reports.Template
{
    public partial class AccountDetailReport
    {
        public AccountDetailReport()
        {
            InitializeComponent();
        }
        public class CreateReport
        {
            public List<AccountDetailPrintViewModel> Data()
            {
                var itemss = new List<AccountDetailPrintViewModel>();
                var folderName = Path.Combine("Reports", "Data");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fileName = "AccountDetail.json";
                var fullPath = Path.Combine(pathToSave, fileName);
                using (StreamReader r = new StreamReader(fullPath))
                {
                    var json = r.ReadToEnd();
                    var items = JsonConvert.DeserializeObject<List<AccountDetailPrintViewModel>>(json);
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
