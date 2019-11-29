using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class SaleInvoice
    {
        public SaleInvoice()
        {
            Payments = new HashSet<Payments>();
            SaleInvDetail = new HashSet<SaleInvDetail>();
        }

        public SaleInvoice(long invoiceId, string invoiceNumber, string invoiceSerial, DateTime? issueDate, int? clientId, decimal? discount, decimal? discRate, DateTime? dueDate, string note, string term, string status)
        {
            InvoiceId = invoiceId;
            InvoiceNumber = invoiceNumber;
            InvoiceSerial = invoiceSerial;
            IssueDate = issueDate;
            ClientId = clientId;
            Discount = discount;
            DiscRate = discRate;
            DueDate = dueDate;
            Note = note;
            Term = term;
            Status = status;
        }

        public long InvoiceId { get; set; }
        public string InvoiceSerial { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int? ClientId { get; set; }
        public string Reference { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? DiscRate { get; set; }
        public decimal? Discount { get; set; }
        public decimal? VatTax { get; set; }
        public decimal? AmountPaid { get; set; }
        public string Note { get; set; }
        public string Term { get; set; }
        public string Status { get; set; }

        public virtual Client Client { get; set; }
        public virtual ICollection<Payments> Payments { get; set; }
        public virtual ICollection<SaleInvDetail> SaleInvDetail { get; set; }
    }
}
