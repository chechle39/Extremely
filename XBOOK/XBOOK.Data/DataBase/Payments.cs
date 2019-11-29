using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class Payments
    {
        public Payments(decimal amount, string bankAccount, long id, long invoiceId, string note, DateTime payDate, string payType, int payTypeID)
        {
            Amount = amount;
            BankAccount = bankAccount;
            Id = id;
            InvoiceId = invoiceId;
            Note = note;
            PayDate = payDate;
            PayType = payType;
            PayTypeId = payTypeID;
        }

        public long Id { get; set; }
        public long InvoiceId { get; set; }
        public DateTime PayDate { get; set; }
        public int PayTypeId { get; set; }
        public string PayType { get; set; }
        public string BankAccount { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }

        public virtual SaleInvoice Invoice { get; set; }
    }
}
