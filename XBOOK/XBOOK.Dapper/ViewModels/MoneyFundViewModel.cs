using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class MoneyFundViewModel
    {
        public decimal OpeningBalance { get; set; }
        public string ReceiptType { get; set; }
        public string CashType { get; set; }
        public string ReceiptNumber { get; set; }
        public string ReceiptID { get; set; }
        public DateTime ReceiptDate { get; set; }
        public string Note { get; set; }
        public string CompanyName { get; set; }
        public decimal Receive { get; set; }
        public decimal Pay { get; set; }
        public decimal ClosingBalance { get; set; }
    }
    public class MoneyFundViewModelGroupViewModel
    {
        public string CashType { get; set; }
        public decimal totalReceive { get; set; }
        public decimal TotalPay { get; set; }
        public decimal totalClosingBalance { get; set; }
        public List<MoneyFundViewModel> MoneyFundData { get; set; }
    }
    public class MoneyFundViewModelPrintViewodel
    {
        public string companyCode { get; set; }
        public string companyNameName { get; set; }
        public string companyAddress { get; set; }
        public string endDate { get; set; }
        public string startDate { get; set; }
        public decimal OpeningBalance { get; set; }
        public string ReceiptType { get; set; }
        public string CashType { get; set; }
        public string ReceiptNumber { get; set; }
        public string ReceiptID { get; set; }
        public DateTime ReceiptDate { get; set; }
        public string Note { get; set; }
        public string CompanyName { get; set; }
        public decimal Receive { get; set; }
        public decimal Pay { get; set; }
        public decimal ClosingBalance { get; set; }

    }

}
