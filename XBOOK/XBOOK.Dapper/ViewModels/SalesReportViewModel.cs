using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class SalesReportViewModel
    {
        public string ProductName { get; set; }
        public string CustomerName { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceID { get; set; }
        public DateTime Date { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public decimal Payment { get; set; }

    }
    public class SalesReportGroupViewModel
    {
        public string productName { get; set; }
        public decimal totalAmount { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal totalPayment { get; set; }
        public List<SalesReportViewModel> SalesReportListData { get; set; }
    }
    public class SalesReportPrintViewodel
    {
    
        public string companyNameName { get; set; }
        public string companyAddress { get; set; }
        public string endDate { get; set; }
        public string startDate { get; set; }
        public string ProductName { get; set; }
        public string CustomerName { get; set; }
        public string InvoiceID { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime Date { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public decimal Payment { get; set; }

    }


}
