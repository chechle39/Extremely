using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class MoneyFundViewModel
    {
        public string MoneyFund { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceID { get; set; }
        public DateTime Date { get; set; }
        public string Note { get; set; }
        public decimal CollectMoney { get; set; }
        public decimal PayMoney { get; set; }
        public decimal ResidualFund { get; set; }

    }
    public class MoneyFundViewModelGroupViewModel
    {
        public string MoneyFund { get; set; }
        public decimal totalCollectMoney { get; set; }
        public decimal TotalPayMoney { get; set; }
        public decimal totalResidualFund { get; set; }
        public List<MoneyFundViewModel> MoneyFundData { get; set; }
    }
    public class MoneyFundViewModelPrintViewodel
    {
        public string companyCode { get; set; }
        public string companyNameName { get; set; }
        public string companyAddress { get; set; }
        public string endDate { get; set; }
        public string startDate { get; set; }
        public string MoneyFund { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceID { get; set; }
        public DateTime Date { get; set; }
        public string Note { get; set; }
        public decimal CollectMoney { get; set; }
        public decimal PayMoney { get; set; }
        public decimal ResidualFund { get; set; }

    }

}
