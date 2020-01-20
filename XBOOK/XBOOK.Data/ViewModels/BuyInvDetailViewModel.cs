using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class BuyInvDetailViewModel
    {
        public long ID { get; set; }
        public long invoiceID { get; set; }
        public int productID { get; set; }
        public string productName { get; set; }
        public string description { get; set; }
        public decimal? qty { get; set; }
        public decimal? price { get; set; }
        public decimal? amount { get; set; }
        public decimal? vat { get; set; }
    }
}
