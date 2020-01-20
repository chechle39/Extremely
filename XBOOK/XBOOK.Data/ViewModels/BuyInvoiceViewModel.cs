using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class BuyInvoiceViewModel
    {
        public BuyInvoiceViewModel()
        {
            BuyInvDetailView = new List<BuyInvDetailViewModel>();
        }
        public long InvoiceId { get; set; }
        public string InvoiceSerial { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int? supplierID { get; set; }
        public string Reference { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? DiscRate { get; set; }
        public decimal? Discount { get; set; }
        public decimal? VatTax { get; set; }
        public decimal? AmountPaid { get; set; }
        public string Note { get; set; }
        public string Term { get; set; }
        public string Status { get; set; }
        public virtual List<BuyInvDetailViewModel> BuyInvDetailView { get; set; }
        public virtual List<Payment2ViewModel> PaymentView { get; set; }
        public List<SupplierViewModel> SupplierData { get; set; }
    }
}
