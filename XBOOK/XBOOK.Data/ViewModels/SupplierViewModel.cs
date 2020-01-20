using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class SupplierViewModel
    {
        public int supplierID { get; set; }
        public string supplierName { get; set; }
        public string address { get; set; }
        public string taxCode { get; set; }
        public string Tag { get; set; }
        public string contactName { get; set; }
        public string email { get; set; }
        public string note { get; set; }
        public string bankAccount { get; set; }
        public virtual BuyInvoiceViewModel BuyInvoiceView { get; set; }
    }
}
