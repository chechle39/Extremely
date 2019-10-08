namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class GeneralLedger
    {
        [Key]
        public long ledgerID { get; set; }
        public string transactionType { get; set; }
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public string vourcherNo { get; set; }
        public System.DateTime dateIssue { get; set; }
        public string clientID { get; set; }
        public string clientName { get; set; }
        public string note { get; set; }
        public string reference { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }
    }
}
