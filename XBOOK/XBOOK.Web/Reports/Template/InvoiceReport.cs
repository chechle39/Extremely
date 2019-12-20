using System;
using System.Collections.Generic;
using System.IO;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
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
            public List<SaleInvoicePrintModel> Data()
            {
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

        private void pictureBox1_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            //  string ds ="D:\\uploaded\\Công Ty Cổ Phần Công Nghệ B24\\images\\logo.jfif";
            string namefolder = GetCurrentColumnValue("yourCompanyCode").ToString();
            string urlimages = "C:\\uploaded\\" + namefolder + "\\images\\logo.png";
            pictureBox1.ImageUrl = urlimages;

        }

        
    }
}
