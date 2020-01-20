using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class SupplierViewModel
    {
        public int SupplierID { get; set; }
        public string SupplierName { get; set; }
        public string Address { get; set; }
        public string Note { get; set; }
        public decimal Outstanding { get; set; }
        public decimal Overdue { get; set; }
    }
}
