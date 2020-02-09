namespace XBOOK.Data.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class AccountChart
    {
        public AccountChart(string accountNumber)
        {
            this.accountNumber = accountNumber;
        }

        public AccountChart(string accountNumber, string accountName, string accountType, decimal? closingBalance, bool isParent, decimal? openingBalance, string parentAccount) : this(accountNumber)
        {
            this.accountName = accountName;
            this.accountType = accountType;
            this.closingBalance = closingBalance;
            this.isParent = isParent;
            this.openingBalance = openingBalance;
            this.parentAccount = parentAccount;
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]

        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public string accountType { get; set; }
        public bool isParent { get; set; }
        public string parentAccount { get; set; }
        public Nullable<decimal> openingBalance { get; set; }
        public Nullable<decimal> closingBalance { get; set; }
    }
}
