using System;

namespace XBOOK.Data.ViewModels
{
    public class PaymentReceiptViewModel
    {
        public long ID { get; set; }
        public string ReceiptNumber { get; set; }
        public string EntryType { get; set; }
        public Nullable<long> SupplierID { get; set; }
        public string SupplierName { get; set; }
        public string ReceiverName { get; set; }
        public System.DateTime PayDate { get; set; }
        public int PayTypeID { get; set; }
        public string PayType { get; set; }
        public string BankAccount { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }
    }
}
