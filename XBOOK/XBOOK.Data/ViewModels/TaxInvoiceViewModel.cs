using System;
using System.Collections.Generic;

namespace XBOOK.Data.ViewModels
{
    public class TaxInvoiceViewModel
    {
        public long invoiceID { get; set; }
        public string invoiceSerial { get; set; }
        public string invoiceNumber { get; set; }
        public Nullable<System.DateTime> issueDate { get; set; }
        public Nullable<System.DateTime> dueDate { get; set; }
        public Nullable<int> clientID { get; set; }
        public string reference { get; set; }
        public Nullable<decimal> subTotal { get; set; }
        public Nullable<decimal> discRate { get; set; }
        public Nullable<decimal> discount { get; set; }
        public Nullable<decimal> vatTax { get; set; }
        public Nullable<decimal> amountPaid { get; set; }
        public string note { get; set; }
        public string term { get; set; }
        public string status { get; set; }
        public virtual List<TaxInvDetailViewModel> TaxInvDetailView { get; set; }
    }
}
