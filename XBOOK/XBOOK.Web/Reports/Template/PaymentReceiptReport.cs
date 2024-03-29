using System;
using System.Collections.Generic;
using System.IO;
using DevExpress.XtraReports.UI;
using Newtonsoft.Json;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Reports.Template
{
    public partial class PaymentReceiptReport
    {
        public PaymentReceiptReport()
        {
            InitializeComponent();
        }

        private void label29_BeforePrint(object sender, System.Drawing.Printing.PrintEventArgs e)
        {

        }
        public class CreateReport
        {
            private  IPaymentReceiptService _paymentReceiptService;
            public List<PaymentReceiptPaymentPrint> Data()
            {
              
                var itemss = new List<PaymentReceiptPaymentPrint>();
                var code = XBOOK.Web.Helpers.GetCompanyCode.GetCode();
                var folderName = $@"C:\inetpub\wwwroot\XBOOK_FILE\{code.Code}\Reports\Data";
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fileName = "PaymentReceipt.json";
                var fullPath = Path.Combine(pathToSave, fileName);
                using (StreamReader r = new StreamReader(fullPath))
                {
                    var json = r.ReadToEnd();
                    var items = JsonConvert.DeserializeObject<List<PaymentReceiptPaymentPrint>>(json);
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
