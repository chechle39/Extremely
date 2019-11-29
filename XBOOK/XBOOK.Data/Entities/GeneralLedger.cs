namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class GeneralLedger
    {
        public GeneralLedger()
        {

        }
        public GeneralLedger(string accNumber, string clientID, string clientName, decimal credit, string crspAccNumber, DateTime dateIssue, decimal debit, string note, string transactionType, string transactionNo)
        {
            this.accNumber = accNumber;
            this.clientID = clientID;
            this.clientName = clientName;
            this.credit = credit;
            this.crspAccNumber = crspAccNumber;
            this.dateIssue = dateIssue;
            this.debit = debit;
            this.note = note;
            this.transactionType = transactionType;
            this.transactionNo = transactionNo;
        }

        [Key]
        public long ledgerID { get; set; }
        public string transactionType { get; set; }
        public string transactionNo { get; set; }
        public string accNumber { get; set; }
        public string crspAccNumber { get; set; }
        public System.DateTime dateIssue { get; set; }
        public string clientID { get; set; }
        public string clientName { get; set; }
        public string note { get; set; }
        public string reference { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }
    }
}
