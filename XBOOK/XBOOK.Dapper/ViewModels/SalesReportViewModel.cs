using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class SalesReportViewModel
    {
        public string ProductName { get; set; }
        public string clientName { get; set; }
        public string invoiceNumber { get; set; }
        public string InvoiceID { get; set; }
        public DateTime issueDate { get; set; }
        public decimal price { get; set; }
        public decimal Quantity { get; set; }
        public decimal Discount { get; set; }
        public decimal Amount { get; set; }

    }
    public class SalesReportGroupViewModel
    {
        public string productName { get; set; }
        public decimal totalAmount { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalQuantity { get; set; }
        public List<SalesReportViewModel> SalesReportListData { get; set; }
    }
    public class SalesReportPrintViewodel
    {
        public string companyCode { get; set; }
        public string companyNameName { get; set; }
        public string companyAddress { get; set; }
        public string endDate { get; set; }
        public string startDate { get; set; }
        public string productName { get; set; }
        public string clientName { get; set; }
        public string invoiceNumber { get; set; }
        public string InvoiceID { get; set; }
        public DateTime issueDate { get; set; }
        public decimal price { get; set; }
        public decimal Quantity { get; set; }
        public decimal Discount { get; set; }
        public decimal Amount { get; set; }

    }


}
