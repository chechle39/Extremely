using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class BuyInvoiceViewModel
    {
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceSerial { get; set; }
        public string SupplierName { get; set; }
        public string Note { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal Amount { get; set; }
        public decimal AmountPaid { get; set; }
        public int SupplierID { get; set; }
        public string ContactName { get; set; }
        public string BankAccount { get; set; }
    }
}
