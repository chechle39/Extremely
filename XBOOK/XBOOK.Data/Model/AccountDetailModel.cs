using System;

namespace XBOOK.Data.Model
{
    public class AccountDetailSerchRequest
    {
        public string accountNumber { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string client { get; set; }
    }
    public class AccountDetailPrintViewModel
    {
        public string companyCode { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string companyNameName { get; set; }
        public string companyAddress { get; set; }
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public string companyName { get; set; }
        public string invoiceNumber { get; set; }
        public DateTime date { get; set; }
        public string transactionNo { get; set; }
        public string reference { get; set; }
        public string crspAccNumber { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public decimal DebitClosing { get; set; }
        public decimal CreditClosing { get; set; }

    }

}
