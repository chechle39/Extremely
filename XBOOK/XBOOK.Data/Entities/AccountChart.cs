namespace XBOOK.Data.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public partial class AccountChart
    {
        public AccountChart(string accountNumber)
        {
            this.accountNumber = accountNumber;
        }

        [Key]
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public string accountType { get; set; }
        public bool isParent { get; set; }
        public string parentAccount { get; set; }
        public Nullable<decimal> openingBalance { get; set; }
        public Nullable<decimal> closingBalance { get; set; }
    }
}
