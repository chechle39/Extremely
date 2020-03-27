using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using XBOOK.Data.Model;

namespace XBOOK.Web.Reports
{
    public partial class InvoiceReport
    {

        public InvoiceReport()
        {
            InitializeComponent();
        }

        public class CreateReport
        {
            private static IHttpContextAccessor httpContextAccessor { get; set; }
            public static void SetHttpContextAccessor(IHttpContextAccessor accessor)
            {
                httpContextAccessor = accessor;
            }
            private static HttpContext User;
            public List<SaleInvoicePrintModel> Data()
            {
                var x = httpContextAccessor;
                var myUser = User;
                var itemss = new List<SaleInvoicePrintModel>();
                var folderName = Path.Combine("Reports", "Data");
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
