using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class Payments_2
    {
        public Payments_2() { }
        public Payments_2(decimal amount, string receiptNumber, long iD, long invoiceID, string note, DateTime payDate, string payType, int payTypeID)
        {
            this.amount = amount;
            this.receiptNumber = receiptNumber;
            ID = iD;
            this.invoiceID = invoiceID;
            this.note = note;
            this.payDate = payDate;
            this.payType = payType;
            this.payTypeID = payTypeID;
        }

        public long ID { get; set; }
        public long invoiceID { get; set; }
        public System.DateTime payDate { get; set; }
        public int payTypeID { get; set; }
        public string payType { get; set; }
        public decimal amount { get; set; }
        public string note { get; set; }
        public string receiptNumber { get; set; }

        public virtual BuyInvoice BuyInvoice { get; set; }
    }
}
