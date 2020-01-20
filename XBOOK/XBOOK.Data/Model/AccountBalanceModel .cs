namespace XBOOK.Data.Model
{
    public class AccountBalanceSerchRequest
    {
        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string Currency { get; set; }
    }
    public class AccountBalanceAccNumberSerchRequest
    {
        public string accountNumber { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string Currency { get; set; }
    }

}
