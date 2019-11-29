using System;
using System.Collections.Generic;

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

    public class SaleInvoiceListRequest
    {
        public string Keyword { get; set; }
        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public bool isIssueDate { get; set; }
    }

    public class requestDeleted
    {
        public long id { get; set; }
    }

    public class genledSearch
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public bool Isaccount { get; set; }
        public bool IsAccountReciprocal { get; set; }
        public string[] AccNumber { get; set; }
        public string Money { get; set; }
    }

    public class Acc
    {
        public string AccNumber { get; set; }
    }
}
