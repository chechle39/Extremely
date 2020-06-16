using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Model
{
    public class BuyInvoiceModelRequest
    {
        private int? supplierID1;
        private string taxInvoiceNumber;
        public BuyInvoiceModelRequest() { }
        public BuyInvoiceModelRequest(decimal? amountPaid, string invoiceNumber, string invoiceSerial, DateTime? issueDate, int? supplierID1, decimal? discount, decimal? discRate, DateTime? dueDate, string note, string term, string status, string taxInvoiceNumber, long invoiceID)
        {
            AmountPaid = amountPaid;
            InvoiceNumber = invoiceNumber;
            InvoiceSerial = invoiceSerial;
            IssueDate = issueDate;
            this.supplierID1 = supplierID1;
            Discount = discount;
            DiscRate = discRate;
            DueDate = dueDate;
            Note = note;
            Term = term;
            Status = status;
            this.taxInvoiceNumber = taxInvoiceNumber;
            InvoiceId = invoiceID;
        }

        public long InvoiceId { get; set; }
        public string InvoiceSerial { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string Reference { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? DiscRate { get; set; }
        public decimal? Discount { get; set; }
        public decimal? VatTax { get; set; }
        public decimal? AmountPaid { get; set; }
        public string Note { get; set; }
        public string Term { get; set; }
        public string Status { get; set; }
        public int supplierID { get; set; }
        public string supplierName { get; set; }
        public string Address { get; set; }
        public string TaxCode { get; set; }
        public string Tag { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public bool Check { get; set; }
        public string TaxInvoiceNumber { get; set; }
    }
}
