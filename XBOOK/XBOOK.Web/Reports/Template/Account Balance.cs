using System;
using System.Collections.Generic;
using System.IO;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
using XBOOK.Data.Model;

namespace XBOOK.Web.Reports.Template
{
    public partial class AccountBalanceReport
    {
        public AccountBalanceReport()
        {
            InitializeComponent();
        }
        public class CreateReport
        {
            public List<AccountBalancePrintModel> Data()
            {
                var itemss = new List<AccountBalancePrintModel>();
                var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
                var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fileName = "AccountBalance.json";
                var fullPath = Path.Combine(pathToSave, fileName);
                using (StreamReader r = new StreamReader(fullPath))
                {
                    var json = r.ReadToEnd();
                    var items = JsonConvert.DeserializeObject<List<AccountBalancePrintModel>>(json);
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
