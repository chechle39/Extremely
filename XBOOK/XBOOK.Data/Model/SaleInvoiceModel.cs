using System;

namespace XBOOK.Data.Model
{
    public class SaleInvoiceModelRequest
    {
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
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string Address { get; set; }
        public string TaxCode { get; set; }
        public string Tag { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
    }
}
