using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

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
                var pathToSave1 = Path.Combine(Directory.GetCurrentDirectory());
                var fileName1 = "companyprofile.json";
                var fullPath1 = Path.Combine(pathToSave1, fileName1);
                using (StreamReader rcompany = new StreamReader(fullPath1))
                {
                    var jsongetcopany = rcompany.ReadToEnd();
                    var data = (from row in jsongetcopany.Split('\n')
                                select row.Split(',')).ToList();
                    var getcopany = JsonConvert.DeserializeObject<List<CompanyProfileViewModel>>(jsongetcopany);
                    var itemss = new List<AccountBalancePrintModel>();
                    var folderName = Path.Combine(getcopany[0].code, "Reports", "Data");
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
}
