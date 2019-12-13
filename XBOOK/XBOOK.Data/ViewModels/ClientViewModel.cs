namespace XBOOK.Data.ViewModels
{
    public class ClientViewModel
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string Address { get; set; }
        public string TaxCode { get; set; }
        public string Tag { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public string Note { get; set; }
        public string bankAccount { get; set; }

        public virtual SaleInvoiceViewModel saleInvoiceView { get; set; }
    }
}
