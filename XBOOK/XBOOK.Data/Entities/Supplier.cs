using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class Supplier
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Supplier()
        {
            this.BuyInvoices = new HashSet<BuyInvoice>();
        }

        public Supplier(int supplierID, string address, string supplierName, string contactName, string email, string note, string tag, string taxCode, string bankAccount)
        {
            this.supplierID = supplierID;
            this.address = address;
            this.supplierName = supplierName;
            this.contactName = contactName;
            this.email = email;
            this.note = note;
            Tag = tag;
            this.taxCode = taxCode;
            this.bankAccount = bankAccount;
        }

        public int supplierID { get; set; }
        public string supplierName { get; set; }
        public string address { get; set; }
        public string taxCode { get; set; }
        public string Tag { get; set; }
        public string contactName { get; set; }
        public string email { get; set; }
        public string note { get; set; }
        public string bankAccount { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BuyInvoice> BuyInvoices { get; set; }
    }
}
