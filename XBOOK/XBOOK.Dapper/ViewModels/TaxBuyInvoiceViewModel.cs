using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class TaxBuyInvoiceViewModel
    {
        public int invoiceId { get; set; }
        public string TaxnvoiceNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceSerial { get; set; }
        public string SupplierName { get; set; }
        public string Note { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal Amount { get; set; }
        public decimal TaxAmount { get; set; }
        public int SupplierID { get; set; }
        public string ContactName { get; set; }
        public string BankAccount { get; set; }
        public string Reference { get; set; }
    }
}
