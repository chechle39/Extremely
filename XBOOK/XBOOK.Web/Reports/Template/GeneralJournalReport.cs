using System;
using System.Collections.Generic;
using System.IO;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
using XBOOK.Data.ViewModels;

namespace XBOOK.Web.Reports.Template
{
    public partial class GenLedReport
    {
        public GenLedReport()
        {
            InitializeComponent();
        }
        public class CreateReport
        {
            public List<GeneralJournalViewModel> Data()
            {
                var itemss = new List<GeneralJournalViewModel>();
                var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
                var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fileName = "GeneralJournal.json";
                var fullPath = Path.Combine(pathToSave, fileName);
                using (StreamReader r = new StreamReader(fullPath))
                {
                    var json = r.ReadToEnd();
                    var items = JsonConvert.DeserializeObject<List<GeneralJournalViewModel>>(json);
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
