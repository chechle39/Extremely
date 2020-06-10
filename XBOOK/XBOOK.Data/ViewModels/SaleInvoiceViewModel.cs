using System;
using System.Collections.Generic;

namespace XBOOK.Data.ViewModels
{
    public class SaleInvoiceViewModel
    {
        public SaleInvoiceViewModel()
        {
            SaleInvDetailView = new List<SaleInvDetailViewModel>();
        }

        public SaleInvoiceViewModel(long invoiceId, string invoiceNumber, string invoiceSerial, DateTime? issueDate, int? clientId, decimal? discount, decimal? discRate, DateTime? dueDate, string note, string term, string status)
        {
            InvoiceId = invoiceId;
            InvoiceNumber = invoiceNumber;
            InvoiceSerial = invoiceSerial;
            IssueDate = issueDate;
            Discount = discount;
            DiscRate = discRate;
            DueDate = dueDate;
            Note = note;
            Term = term;
            Status = status;
            ClientId = clientId;
        }

        public string TaxInvoiceNumber { get; set; }
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
        public bool Check { get; set; }
        public bool OldCheck { get; set; }
        public string OldTaxInvoiceNumber { get; set; }
        public string OldInvoiceNumber { get; set; }
        public virtual List<SaleInvDetailViewModel> SaleInvDetailView { get; set; }
        public virtual List<PaymentViewModel> PaymentView { get; set; }
        public List<ClientViewModel> ClientData { get; set; }
    }
}
