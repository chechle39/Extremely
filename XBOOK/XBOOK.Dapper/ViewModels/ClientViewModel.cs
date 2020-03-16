using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class ClientViewModel
    {
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public string Address { get; set; }
        public string Note { get; set; }
        public decimal Outstanding { get; set; }
        public decimal Overdue { get; set; }
        public string TaxCode { get; set; }
        public string Email { get; set; }
        public string Tag { get; set; }
        public string ContactName { get; set; }
        public string BankAccount { get; set; }
    }
}
