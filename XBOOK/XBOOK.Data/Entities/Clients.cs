namespace XBOOK.Data.Entities
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    public partial class Client
    {
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Client()
        {
        }

        public Client(int clientId, string address, string clientName, string contactName, string email, string note, string tag, string taxCode, string bankAccount)
        {
            clientID = clientId;
            this.address = address;
            this.clientName = clientName;
            this.contactName = contactName;
            this.email = email;
            this.note = note;
            Tag = tag;
            this.taxCode = taxCode;
            this.bankAccount = bankAccount;
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int clientID { get; set; }
        public string clientName { get; set; }
        public string address { get; set; }
        public string taxCode { get; set; }
        public string Tag { get; set; }
        public string contactName { get; set; }
        public string email { get; set; }
        public string note { get; set; }
        public string bankAccount { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SaleInvoice> SaleInvoices { get; set; }
    }
}
