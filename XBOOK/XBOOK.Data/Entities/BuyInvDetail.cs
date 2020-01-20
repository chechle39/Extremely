using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class BuyInvDetail
    {
        public BuyInvDetail() { }

        public BuyInvDetail(long invoiceID, decimal? price, int productID, string productName, decimal? qty, decimal? vat, long iD, decimal? amount)
        {
            this.invoiceID = invoiceID;
            this.price = price;
            this.productID = productID;
            this.productName = productName;
            this.qty = qty;
            this.vat = vat;
            ID = iD;
            this.amount = amount;
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public long ID { get; set; }
        public long invoiceID { get; set; }
        public int productID { get; set; }
        public string productName { get; set; }
        public string description { get; set; }
        public Nullable<decimal> qty { get; set; }
        public Nullable<decimal> price { get; set; }
        public Nullable<decimal> amount { get; set; }
        public Nullable<decimal> vat { get; set; }

        public virtual BuyInvoice BuyInvoice { get; set; }
        public virtual Product Product { get; set; }
    }
}
