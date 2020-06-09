using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class TaxInvDetailViewModel
    {
        public long ID { get; set; }
        public long taxInvoiceID { get; set; }
        public int productID { get; set; }
        public string productName { get; set; }
        public string description { get; set; }
        public Nullable<decimal> qty { get; set; }
        public Nullable<decimal> price { get; set; }
        public Nullable<decimal> amount { get; set; }
        public Nullable<decimal> vat { get; set; }
        public long SaleInvoiceDetailId { get; set; }
    }
}
