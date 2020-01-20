using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class GeneralLedgerViewModel
    {
        public string companyName { get; set; }
        public string companyAddress { get; set; }
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
        public List<AccountBalanceViewModel> AccountBalanceViewModel { get; set; }
      
    }
    public class GeneralJournalViewModel
    {
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string companyName { get; set; }
        public string companyAddress { get; set; }
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
