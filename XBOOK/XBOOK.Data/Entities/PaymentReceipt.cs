using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class PaymentReceipt
    {
        public PaymentReceipt(decimal amount, string bankAccount, long? supplierID, string supplierName, string entryType, long iD, string note, DateTime payDate, string payType, string payName, string receiptNumber, string receiverName)
        {
            this.amount = amount;
            this.bankAccount = bankAccount;
            this.supplierID = supplierID;
            this.supplierName = supplierName;
            this.entryType = entryType;
            ID = iD;
            this.note = note;
            this.payDate = payDate;
            this.payType = payType;
            this.payName = payName;
            this.receiptNumber = receiptNumber;
            this.receiverName = receiverName;
        }

        public long ID { get; set; }
        public string receiptNumber { get; set; }
        public string entryType { get; set; }
        public Nullable<long> supplierID { get; set; }
        public string supplierName { get; set; }
        public string receiverName { get; set; }
        public System.DateTime payDate { get; set; }
        public string payName { get; set; }
        public string payType { get; set; }
        public string bankAccount { get; set; }
        public decimal amount { get; set; }
        public string note { get; set; }
    }
}
