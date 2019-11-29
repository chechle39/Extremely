using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class Client
    {
        public Client()
        {
           // SaleInvoice = new HashSet<SaleInvoice>();
        }

        public Client(int clientId, string address, string clientName, string contactName, string email, string note, string tag, string taxCode)
        {
            ClientName = clientName;
            ContactName = contactName;
            Email = email;
            Note = note;
            Tag = tag;
            TaxCode = taxCode;
        }

        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string Address { get; set; }
        public string TaxCode { get; set; }
        public string Tag { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public string Note { get; set; }

        public virtual ICollection<SaleInvoice> SaleInvoice { get; set; }
    }
}
