namespace XBOOK.Data.Model
{
    public class ClientCreateRequet
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string Address { get; set; }
        public string TaxCode { get; set; }
        public string Tag { get; set; }
        public string ContactName { get; set; }
        public string Email { get; set; }
        public string Note { get; set; }
    }
    public class ClientSerchRequest
    {
        public string ClientKeyword { get; set; }
       // public bool isGrid { get; set; }
    }
    public class ProductSerchRequest
    {
        public string ProductKeyword { get; set; }
        public bool IsGrid { get; set; }
    }
}
