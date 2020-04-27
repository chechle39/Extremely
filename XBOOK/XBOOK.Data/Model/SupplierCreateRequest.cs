using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Model
{
    public class SupplierCreateRequest
    {
        public int supplierID { get; set; }
        public string supplierName { get; set; }
        public string Address { get; set; }
        public string TaxCode { get; set; }
        public string Tag { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public string Note { get; set; }
        public string bankAccount { get; set; }
    }
    public class SupplierExportRequest
    {
        public int supplierID { get; set; }
        public string supplierName { get; set; }
        public string Address { get; set; }
        public string TaxCode { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public string Note { get; set; }
        public string bankAccount { get; set; }
    }
}
