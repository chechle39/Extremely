using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class Payment2ViewModel
    {
        public long ID { get; set; }
        public long invoiceID { get; set; }
        public System.DateTime payDate { get; set; }
        public string payName { get; set; }
        public string payType { get; set; }
        public decimal amount { get; set; }
        public string note { get; set; }
        public string receiptNumber { get; set; }
    }
}
