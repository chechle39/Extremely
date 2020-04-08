using System;
using System.Collections.Generic;
using System.IO;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.Repositories;

namespace XBOOK.Web.Reports
{
    public partial class InvoiceReport
    {
        
     
        public InvoiceReport(ICompanyProfileReponsitory companyProfileReponsitory)
        {
            InitializeComponent();
        }

        public class CreateReport
        {
           
            public List<SaleInvoicePrintModel> Data()
            {
                var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
                var itemss = new List<SaleInvoicePrintModel>();
                var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fileName = "InvoiceReport.json";
                var fullPath = Path.Combine(pathToSave, fileName);
                using (StreamReader r = new StreamReader(fullPath))
                {
                    var json = r.ReadToEnd();
                    var items = JsonConvert.DeserializeObject<List<SaleInvoicePrintModel>>(json);
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
