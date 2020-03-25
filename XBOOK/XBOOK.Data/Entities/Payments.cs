namespace XBOOK.Data.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class Payments
    {
        public Payments()
        {
        }
        public Payments(decimal amount, string receiptNumber, long id, long invoiceId, string note, DateTime payDate, string payType, string payName)
        {
            this.amount = amount;
            this.receiptNumber = receiptNumber;
            invoiceID = invoiceId;
            this.note = note;
            this.payDate = payDate;
            this.payType = payType;
            this.payName = payName;
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]

        public long ID { get; set; }
        public long invoiceID { get; set; }
        public System.DateTime payDate { get; set; }
        public string payName { get; set; }
        public string payType { get; set; }
        public string receiptNumber { get; set; }
        public decimal amount { get; set; }
        public string note { get; set; }
    
        public virtual SaleInvoice SaleInvoice { get; set; }
    }
}
