namespace XBOOK.Data.ViewModels
{
    public class SaleInvDetailViewModel
    {
        private long taxInvoiceID;
        private long saleInvoiceDetailId;

        public SaleInvDetailViewModel() { }

        public SaleInvDetailViewModel(decimal? amount, string description, long iD, decimal? price, int productID, string productName, decimal? qty, long taxInvoiceID, decimal? vat, long saleInvoiceDetailId)
        {
            Amount = amount;
            Description = description;
            Id = iD;
            Price = price;
            ProductId = productID;
            ProductName = productName;
            Qty = qty;
            this.taxInvoiceID = taxInvoiceID;
            Vat = vat;
            this.saleInvoiceDetailId = saleInvoiceDetailId;
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
    }
}
