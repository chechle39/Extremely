namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class SaleInvoice
    {
        private string clientName;
        private string email;
        private string clientId;

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SaleInvoice()
        {
            this.Payments = new HashSet<Payments>();
            this.SaleInvDetails = new HashSet<SaleInvDetail>();
        }


        public SaleInvoice(long invoiceId, string invoiceNumber, string invoiceSerial, DateTime? issueDate, int? clientId, decimal? discount, decimal? discRate, DateTime? dueDate, string note, string term, string status)
        {
            invoiceID = invoiceId;
            this.invoiceNumber = invoiceNumber;
            this.invoiceSerial = invoiceSerial;
            this.issueDate = issueDate;
            clientID = clientId;
            this.discount = discount;
            this.discRate = discRate;
            this.dueDate = dueDate;
            this.note = note;
            this.term = term;
            this.status = status;
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public long invoiceID { get; set; }
        public string invoiceSerial { get; set; }
        public string invoiceNumber { get; set; }
        public Nullable<System.DateTime> issueDate { get; set; }
        public Nullable<System.DateTime> dueDate { get; set; }

        public Nullable<int> clientID { get; set; }
        public string reference { get; set; }
        public Nullable<decimal> subTotal { get; set; }
        public Nullable<decimal> discRate { get; set; }
        public Nullable<decimal> discount { get; set; }
        public Nullable<decimal> vatTax { get; set; }
        public Nullable<decimal> amountPaid { get; set; }
        public string note { get; set; }
        public string term { get; set; }
        public string status { get; set; }
        [ForeignKey("clientID")]
        public virtual Client Clients { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Payments> Payments { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SaleInvDetail> SaleInvDetails { get; set; }
    }
}
