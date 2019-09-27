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
           // this.SaleInvoices = new HashSet<SaleInvoice>();
        }

        public Client(int _clientID, string _clientName, string _address, string _taxCode, string _Tag, string _contactName, string _email, string _note)
        {
            clientID = _clientID;
            clientName = _clientName;
            address = _address;
            taxCode = _taxCode;
            Tag = _Tag;
            contactName = _contactName;
            email = _email;
            note = _note;
         //   SaleInvoices = new List<SaleInvoice>();
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
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SaleInvoice> SaleInvoices { get; set; }
    }
}
