using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class TaxBuyInvDetail
    {
        [Key]
        public long ID { get; set; }
        public long invoiceID { get; set; }
        public int productID { get; set; }
        public string productName { get; set; }
        public string description { get; set; }
        public Nullable<decimal> qty { get; set; }
        public Nullable<decimal> price { get; set; }
        public Nullable<decimal> amount { get; set; }
        public Nullable<decimal> vat { get; set; }
        public long SaleInvDetailID { get; set; }
        public virtual Product Product { get; set; }
        public virtual TaxBuyInvoice TaxBuyInvoice { get; set; }
    }
}
