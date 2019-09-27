namespace XBOOK.Service.ViewModels
{
    public class SaleInvDetailViewModel
    {
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
