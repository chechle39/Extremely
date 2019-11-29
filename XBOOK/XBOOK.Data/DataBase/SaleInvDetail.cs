using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class SaleInvDetail
    {
        public SaleInvDetail(long invoiceId, decimal? price, int productId, string productName, decimal? qty, decimal? vat, long id, decimal? amount)
        {
            InvoiceId = invoiceId;
            Price = price;
            ProductId = productId;
            ProductName = productName;
            Qty = qty;
            Vat = vat;
            Id = id;
            Amount = amount;
        }

        public long Id { get; set; }
        public long InvoiceId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal? Qty { get; set; }
        public decimal? Price { get; set; }
        public decimal? Amount { get; set; }
        public decimal? Vat { get; set; }

        public virtual SaleInvoice Invoice { get; set; }
        public virtual Product Product { get; set; }
    }
}
