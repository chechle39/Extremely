namespace XBOOK.Data.Entities
{
    using System;

    public partial class SaleInvDetail
    {
        public SaleInvDetail() { }
        public SaleInvDetail(long invoiceId, decimal? price, int productId, string productName, decimal? qty, decimal? vat, long id,decimal? amount)
        {
            invoiceID = invoiceId;
            this.price = price;
            productID = productId;
            this.productName = productName;
            this.qty = qty;
            this.vat = vat;
            ID = id;
            this.amount = amount;
        }

        public long ID { get; set; }
        public long invoiceID { get; set; }
        public int productID { get; set; }
        public string productName { get; set; }
        public string description { get; set; }
        public Nullable<decimal> qty { get; set; }
        public Nullable<decimal> price { get; set; }
        public Nullable<decimal> amount { get; set; }
        public Nullable<decimal> vat { get; set; }
    
        public virtual Product Product { get; set; }
        public virtual SaleInvoice SaleInvoice { get; set; }
    }
}
