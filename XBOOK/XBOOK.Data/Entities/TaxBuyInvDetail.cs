using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XBOOK.Data.Entities
{
    public partial class TaxBuyInvDetail
    {
        public TaxBuyInvDetail() { }
        public TaxBuyInvDetail(decimal? amount, string description, long iD, decimal? price, int productID, string productName, decimal? qty, long saleInvDetailID, long invoiceID, decimal? vat)
        {
            this.amount = amount;
            this.description = description;
            ID = iD;
            this.price = price;
            this.productID = productID;
            this.productName = productName;
            this.qty = qty;
            SaleInvDetailID = saleInvDetailID;
            this.invoiceID = invoiceID;
            this.vat = vat;
        }

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
        [ForeignKey("invoiceID")]
        public virtual TaxBuyInvoice TaxBuyInvoice { get; set; }
    }
}
