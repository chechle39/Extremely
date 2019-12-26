using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Model
{
    public class requestGetIMG
    {
        public string ImgName { get; set; }
    }
    public class requestGetFile
    {
        public string Invoice { get; set; }
        public string Seri { get; set; }
    }
    public class ResponseFileName
    {
        public string FileName { get; set; }
    }

    public class MoneyReceiptRequest
    {
        public string Keyword { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Currency { get; set; }

    }

    public class MoneyReceiptPayment
    {
        public List<Invoice> InvoiceId { get; set; }
        public string ReceiptNumber { get; set; }
        public string EntryType { get; set; }
        public Nullable<long> ClientID { get; set; }
        public string ClientName { get; set; }
        public string ReceiverName { get; set; }
        public System.DateTime PayDate { get; set; }
        public int PayTypeID { get; set; }
        public string PayType { get; set; }
        public string BankAccount { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }
    }

    public class Invoice
    {
        public long InvoiceId { get; set; }
        public DateTime DueDate { get; set; }
        public decimal AmountIv { get; set; }
    }
}
