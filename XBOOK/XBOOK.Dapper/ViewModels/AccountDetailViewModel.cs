using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class AccountDetailViewModel
    {
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public string companyName { get; set; }
        public string transactionNo { get; set; }
        public string invoiceNumber { get; set; }
        public DateTime date { get; set; }
        public DateTime dateIssue { get; set; }
        public string reference { get; set; }
        public string crspAccNumber { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public decimal DebitClosing { get; set; }
        public decimal CreditClosing { get; set; }
        public decimal DebitOpening { get; set; }
        public decimal CreditOpening { get; set; }
    }

    public class AccountDetailGroupViewModel
    {
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public string companyName { get; set; }
        public decimal totalDebit { get; set; }
        public decimal totalCredit { get; set; }
        public decimal totalDebitClosing { get; set; }
        public decimal totalCreditClosing { get; set; }
        public decimal totalDebitOpening { get; set; }
        public decimal totalCreditOpening { get; set; }
        public List<AccountDetailViewModel> AccountDetailViewModel { get; set; }

    }

}
