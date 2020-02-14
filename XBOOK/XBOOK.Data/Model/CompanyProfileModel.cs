namespace XBOOK.Data.Model
{
    public class CompanyProfileCreateRequet
    {
        public int Id { get; set; }
        public string companyName { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string zipCode { get; set; }
        public string currency { get; set; }
        public string dateFormat { get; set; }
        public string bizPhone { get; set; }
        public string mobilePhone { get; set; }
        public string directorName { get; set; }
        public string logoFilePath { get; set; }
        public string taxCode { get; set; }
        public string bankAccount { get; set; }
        public string code { get; set; }
    }
    public class CompanyProfileSerchRequest
    {
        public string ClientKeyword { get; set; }
       // public bool isGrid { get; set; }
    }

}
