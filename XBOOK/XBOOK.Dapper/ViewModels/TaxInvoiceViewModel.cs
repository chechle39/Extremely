using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class TaxInvoiceViewModel
    {
        public int TaxInvoiceId { get; set; }
        public string TaxInvoiceNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceSerial { get; set; }
        public string ClientName { get; set; }
        public string Note { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal Amount { get; set; }
        public decimal TaxAmount { get; set; }
        public int ClientID { get; set; }
        public string ContactName { get; set; }
        public string BankAccount { get; set; }
        public string Reference { get; set; }
    }
}
