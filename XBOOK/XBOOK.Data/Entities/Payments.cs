namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class Payments
    {
        public Payments()
        {
        }
        public Payments(decimal amount, string bankAccount, long id, long invoiceId, string note, DateTime payDate, string payType, int payTypeID)
        {
            this.amount = amount;
            this.bankAccount = bankAccount;
            invoiceID = invoiceId;
            this.note = note;
            this.payDate = payDate;
            this.payType = payType;
            this.payTypeID = payTypeID;
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]

 public long ID { get; set; }
        public long invoiceID { get; set; }
        public System.DateTime payDate { get; set; }
        public int payTypeID { get; set; }
        public string payType { get; set; }
        public string bankAccount { get; set; }
        public decimal amount { get; set; }
        public string note { get; set; }
    
        public virtual SaleInvoice SaleInvoice { get; set; }
    }
}
