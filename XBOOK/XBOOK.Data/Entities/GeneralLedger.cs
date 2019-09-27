namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class GeneralLedger
    {
        public long ID { get; set; }
        public string accountNumber { get; set; }
        public string transactionType { get; set; }
        public string transactionName { get; set; }
        public System.DateTime dateIssue { get; set; }
        public string clientID { get; set; }
        public string clientName { get; set; }
        public string note { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }
    }
}
