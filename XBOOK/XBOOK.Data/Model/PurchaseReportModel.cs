namespace XBOOK.Data.Model
{
    public class PurchaseReportSerchRequest
    {

        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string[] ProductName { get; set; }
        public string[] Supplier { get; set; }
    }


}
