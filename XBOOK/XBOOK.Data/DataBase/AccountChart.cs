using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class AccountChart
    {
        public AccountChart(string accountNumber)
        {
            AccountNumber = accountNumber;
        }

        public string AccountNumber { get; set; }
        public string AccountName { get; set; }
        public string AccountType { get; set; }
        public bool IsParent { get; set; }
        public string ParentAccount { get; set; }
        public decimal? OpeningBalance { get; set; }
        public decimal? ClosingBalance { get; set; }
    }
}
