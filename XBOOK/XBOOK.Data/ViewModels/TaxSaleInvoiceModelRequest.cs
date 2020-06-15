using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class TaxSaleInvoiceModelRequest
    {
        public long taxInvoiceID { get; set; }
        public string invoiceSerial { get; set; }
        public string invoiceNumber { get; set; }
        public Nullable<System.DateTime> issueDate { get; set; }
        public Nullable<System.DateTime> dueDate { get; set; }
        public int? clientID { get; set; }
        public string clientName { get; set; }
        public string reference { get; set; }
        public Nullable<decimal> subTotal { get; set; }
        public Nullable<decimal> discRate { get; set; }
        public Nullable<decimal> discount { get; set; }
        public Nullable<decimal> vatTax { get; set; }
        public Nullable<decimal> amountPaid { get; set; }
        public string note { get; set; }
        public string term { get; set; }
        public string status { get; set; }
        public string taxInvoiceNumber { get; set; }
        public List<ClientViewModel> ClientData { get; set; }
        public virtual List<TaxInvDetailViewModel> TaxInvDetailView { get; set; }
        public string address { get; set; }
        public string taxCode { get; set; }
        public string tag { get; set; }
        public string contactName { get; set; }
        public string email { get; set; }
    }
}
