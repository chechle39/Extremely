using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class ProductViewModel
    {
        public int productID { get; set; }
        public string productName { get; set; }
        public string description { get; set; }
        public decimal? unitPrice { get; set; }
        public int? categoryID { get; set; }
        public string Unit { get; set; }
    }
}
