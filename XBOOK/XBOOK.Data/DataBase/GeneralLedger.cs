using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class GeneralLedger
    {
        public GeneralLedger(string accNumber, string clientID, string clientName, decimal credit, string crspAccNumber, DateTime dateIssue, decimal debit, string note, string transactionType, string transactionNo)
        {
            AccNumber = accNumber;
            ClientId = clientID;
            ClientName = clientName;
            Credit = credit;
            CrspAccNumber = crspAccNumber;
            DateIssue = dateIssue;
            Debit = debit;
            Note = note;
            TransactionType = transactionType;
            TransactionNo = transactionNo;
        }

        public long LedgerId { get; set; }
        public string TransactionType { get; set; }
        public string TransactionNo { get; set; }
        public string AccNumber { get; set; }
        public string CrspAccNumber { get; set; }
        public DateTime DateIssue { get; set; }
        public string ClientId { get; set; }
        public string ClientName { get; set; }
        public string Note { get; set; }
        public string Reference { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
    }
}
