using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class GetUn_mapToInvoiceReceiptViewModel
    {
        public DateTime PayDate { get; set; }
        public decimal Amount { get; set; }
        public string ReceiptNumber { get; set; }
        public string Description { get; set; }
    }
    public class GetUn_mapToInvoiceReceiptRequest
    {
        public long InvoiveID { get; set; }
        public int IsSale { get; set; }
        public string Key { get; set; }
    }
}
