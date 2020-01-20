namespace XBOOK.Data.Model
{
    public class SalesReportModelSearchRequest
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string [] ProductName { get; set; }
        public string [] Client { get; set; }

    }

}
