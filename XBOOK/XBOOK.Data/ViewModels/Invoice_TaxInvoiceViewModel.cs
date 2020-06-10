using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class Invoice_TaxInvoiceViewModel
    {
        public long ID { get; set; }
        public bool isSale { get; set; }
        public string invoiceNumber { get; set; }
        public string taxInvoiceNumber { get; set; }
        public Nullable<decimal> amount { get; set; }
    }
}
