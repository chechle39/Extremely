using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class InvoiceViewModel
    {
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public string TaxInvoiceNumber { get; set; }
        public string InvoiceSerial { get; set; }
        public string ClientName { get; set; }
        public string Note { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal Amount { get; set; }
        public decimal AmountPaid { get; set; }
        public int ClientID { get; set; }
        public string ContactName { get; set; }
        public string BankAccount { get; set; }
    }

    public class UnTaxDeclaredInvoiceViewModel
    {
        public string InvoiceNumber { get; set; }
        public DateTime? IssueDate { get; set; }
        public string ClientName { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public decimal NotTaxing { get; set; }
    }
    public class UnTaxDeclaredInvoiceRequest
    {
        public Nullable<DateTime> FromDate { get; set; }
        public Nullable<DateTime> ToDate { get; set; }
        public bool isSale { get; set; }
    }
}
