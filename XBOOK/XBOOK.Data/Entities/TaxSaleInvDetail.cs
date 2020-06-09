using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class TaxSaleInvDetail
    {
        public TaxSaleInvDetail(long taxInvoiceID, decimal? price, int productID, string productName, decimal? qty, decimal? vat, long iD, decimal? amount, long saleInvoiceDetailId)
        {
            this.taxInvoiceID = taxInvoiceID;
            this.price = price;
            this.productID = productID;
            this.productName = productName;
            this.qty = qty;
            this.vat = vat;
            ID = iD;
            this.amount = amount;
            SaleInvoiceDetailId = saleInvoiceDetailId;
        }

        [Key]
        public long ID { get; set; }
        public long taxInvoiceID { get; set; }
        public int productID { get; set; }
        public string productName { get; set; }
        public string description { get; set; }
        public Nullable<decimal> qty { get; set; }
        public Nullable<decimal> price { get; set; }
        public Nullable<decimal> amount { get; set; }
        public Nullable<decimal> vat { get; set; }
        public long SaleInvoiceDetailId { get; set; }
        public virtual Product Product { get; set; }
        public virtual TaxSaleInvoice TaxSaleInvoice { get; set; }
    }
}
