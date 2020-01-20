using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class MoneyReceiptViewModel
    {
        public long ID { get; set; }
        public string ReceiptNumber { get; set; }
        public string EntryType { get; set; }
        public Nullable<long> ClientID { get; set; }
        public string ClientName { get; set; }
        public string ReceiverName { get; set; }
        public System.DateTime PayDate { get; set; }
        public int PayTypeID { get; set; }
        public string PayType { get; set; }
        public string BankAccount { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }
    }
    public class MoneyReceiptViewModelPrint
    {
        public long ID { get; set; }
        public string ReceiptNumber { get; set; }
        public string yourCompanyAddress { get; set; }
        public string yourCompanyName { get; set; }
        public string EntryType { get; set; }
        public Nullable<long> ClientID { get; set; }
        public string ClientName { get; set; }
        public string ReceiverName { get; set; }
        public System.DateTime PayDate { get; set; }
        public int PayTypeID { get; set; }
        public string PayType { get; set; }
        public string BankAccount { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }
    }

}
