using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Entities
{
    public partial class BuyInvoice
    {
        private List<BuyInvDetailViewModel> buyInvDetailView;
        private List<Payment2ViewModel> paymentView;
        private List<SupplierViewModel> supplierData;

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public BuyInvoice()
        {
            this.BuyInvDetails = new HashSet<BuyInvDetail>();
            this.Payments_2 = new HashSet<Payments_2>();
        }

        public BuyInvoice(long invoiceId, string invoiceNumber, string invoiceSerial, DateTime? issueDate, int supplierID, decimal? discount, decimal? discRate, DateTime? dueDate, string note, string term, string status, string taxInvoiceNumber)
        {
            invoiceID = invoiceId;
            this.invoiceNumber = invoiceNumber;
            this.invoiceSerial = invoiceSerial;
            this.issueDate = issueDate;
            this.supplierID = supplierID;
            this.discount = discount;
            this.discRate = discRate;
            this.dueDate = dueDate;
            this.note = note;
            this.term = term;
            this.status = status;
            TaxInvoiceNumber = taxInvoiceNumber;
        }

        public BuyInvoice(decimal? amountPaid, List<BuyInvDetailViewModel> buyInvDetailView, decimal? discount, decimal? discRate, DateTime? dueDate, long invoiceId, string invoiceNumber, string invoiceSerial, DateTime? issueDate, string note, List<Payment2ViewModel> paymentView, string reference, string status, decimal? subTotal, List<SupplierViewModel> supplierData, int? supplierID, string term, decimal? vatTax)
        {
            this.amountPaid = amountPaid;
            this.buyInvDetailView = buyInvDetailView;
            this.discount = discount;
            this.discRate = discRate;
            this.dueDate = dueDate;
            invoiceID = invoiceId;
            this.invoiceNumber = invoiceNumber;
            this.invoiceSerial = invoiceSerial;
            this.issueDate = issueDate;
            this.note = note;
            this.paymentView = paymentView;
            this.reference = reference;
            this.status = status;
            this.subTotal = subTotal;
            this.supplierData = supplierData;
            this.supplierID = supplierID;
            this.term = term;
            this.vatTax = vatTax;
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BuyInvDetail> BuyInvDetails { get; set; }
        public virtual Supplier Supplier { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Payments_2> Payments_2 { get; set; }
    }
}
