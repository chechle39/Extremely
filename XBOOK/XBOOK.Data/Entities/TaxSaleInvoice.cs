using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class TaxSaleInvoice
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public TaxSaleInvoice()
        {
            this.TaxSaleInvDetails = new HashSet<TaxSaleInvDetail>();
        }

        public TaxSaleInvoice(long taxInvoiceID, string invoiceNumber, string invoiceSerial, DateTime? issueDate, int? clientID, decimal? discount, decimal? discRate, DateTime? dueDate, string note, string term, string status, string taxInvoiceNumber)
        {
            this.taxInvoiceID = taxInvoiceID;
            this.invoiceNumber = invoiceNumber;
            this.invoiceSerial = invoiceSerial;
            this.issueDate = issueDate;
            this.clientID = clientID;
            this.discount = discount;
            this.discRate = discRate;
            this.dueDate = dueDate;
            this.note = note;
            this.term = term;
            this.status = status;
            TaxInvoiceNumber = taxInvoiceNumber;
        }

        [Key]
        public long taxInvoiceID { get; set; }
        public string invoiceSerial { get; set; }
        public string invoiceNumber { get; set; }
        public string TaxInvoiceNumber { get; set; }
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
        public virtual Client Client { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TaxSaleInvDetail> TaxSaleInvDetails { get; set; }
    }
}
