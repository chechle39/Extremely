using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace XBOOK.Data.Entities
{
    public class Invoice_TaxInvoice
    {
        [Key]
        public long ID { get; set; }
        public bool isSale { get; set; }
        public string invoiceNumber { get; set; }
        public string taxInvoiceNumber { get; set; }
        public Nullable<decimal> amount { get; set; }
        public long invoiceID { get; set; }
        public long taxInvoiceID { get; set; }
    }
}
