using System;

namespace XBOOK.Data.Model
{
    public class AccountBalancePrintModel
    {
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string companyName { get; set; }
        public string companyAddress { get; set; }
        public string accNumber { get; set; }
        public string accName { get; set; }
        public decimal debitOpening { get; set; }
        public decimal creditOpening { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }
        public decimal debitClosing { get; set; }
        public decimal creditClosing { get; set; }
    }
 
}
