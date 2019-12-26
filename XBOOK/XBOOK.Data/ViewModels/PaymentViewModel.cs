using System;

namespace XBOOK.Data.ViewModels
{
    public class PaymentViewModel
    {
        public long Id { get; set; }
        public long InvoiceId { get; set; }
        public DateTime PayDate { get; set; }
        public int PayTypeID { get; set; }
        public string PayType { get; set; }
        public string ReceiptNumber { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }
    }
}
