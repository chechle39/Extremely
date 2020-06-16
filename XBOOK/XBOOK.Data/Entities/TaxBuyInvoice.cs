using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Entities
{
    public partial class TaxBuyInvoice
    {
        private long taxInvoiceID;
        private string address;
        private int? clientID;
        private string clientName;
        private string contactName;
        private string email;
        private string tag;
        private string taxCode;
        private List<TaxInvDetailViewModel> taxInvDetailView;

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public TaxBuyInvoice()
        {
            this.TaxBuyInvDetails = new HashSet<TaxBuyInvDetail>();
        }

        public TaxBuyInvoice(long taxInvoiceID, string taxInvoiceNumber, string term, decimal? vatTax, string address, decimal? amountPaid, int? clientID, string clientName, string contactName, decimal? discount, decimal? discRate, DateTime? dueDate, string email, string invoiceNumber, string invoiceSerial, DateTime? issueDate, string note, string reference, string status, decimal? subTotal, string tag, string taxCode)
        {
            this.taxInvoiceID = taxInvoiceID;
            TaxInvoiceNumber = taxInvoiceNumber;
            this.term = term;
            this.vatTax = vatTax;
            this.address = address;
            this.amountPaid = amountPaid;
            this.supplierID = clientID;
            this.contactName = contactName;
            this.discount = discount;
            this.discRate = discRate;
            this.dueDate = dueDate;
            this.email = email;
            this.invoiceNumber = invoiceNumber;
            this.invoiceSerial = invoiceSerial;
            this.issueDate = issueDate;
            this.note = note;
            this.reference = reference;
            this.status = status;
            this.subTotal = subTotal;
            this.tag = tag;
            this.taxCode = taxCode;
        }
        [Key]
        public long invoiceID { get; set; }
        public string invoiceSerial { get; set; }
        public string invoiceNumber { get; set; }
        public string TaxInvoiceNumber { get; set; }
        public Nullable<System.DateTime> issueDate { get; set; }
        public Nullable<System.DateTime> dueDate { get; set; }
        public Nullable<int> supplierID { get; set; }
        public string reference { get; set; }
        public Nullable<decimal> subTotal { get; set; }
        public Nullable<decimal> discRate { get; set; }
        public Nullable<decimal> discount { get; set; }
        public Nullable<decimal> vatTax { get; set; }
        public Nullable<decimal> amountPaid { get; set; }
        public string note { get; set; }
        public string term { get; set; }
        public string status { get; set; }

        public virtual Supplier Supplier { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TaxBuyInvDetail> TaxBuyInvDetails { get; set; }
    }
}
